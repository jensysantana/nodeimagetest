'use strict'
const GlobalHelpers = require('../../helpers/global-helpers'),
    nodeEmailSender = require('../../helpers/NodeEmail'),
    jsonWebToken = require('../../helpers/jsonwebtoken');
const { AuthModel } = require('../../models/Auth/Auth');
const moment = require('moment');

const { AuthValidation } = require("../../validations/authValidation");
const {

    // tokenConfigs, appConf, frontEnd 
    TOKEN: { SIGN_UP, SIGN_IN, ACCESS_TOKEN_SECRET_KEY },
    APP: { APP_FRONT_END_URL, NAME_APP },
    BLOCK_OPT_OR_EMAIL_SENDER_TIME: {
        EMAIL_SENDER_LIMIT,
        EMAIL_SENDER_TIME_LIMIT,
        PHONE_OTP_LIMIT,
        PHONE_OTP_TIME_LIMIT
    }
} = require('../../../config/config');

//=======================================
// Start sign up
//=======================================
const SignUpMiddleware = async(req, res, next) => {
    try {

        const userInf = JSON.parse(req.body.data);
        const { fname, lname, email, password, cpassword } = userInf;

        const unFilterData = { fname, lname, email, password, cpassword };
        await AuthValidation(unFilterData, 'signUp');
        const userOnline = await AuthModel.findOne({ email: email }, 'deletedAt');

        if (userOnline) {
            if (userOnline.deletedAt !== null) {
                return res.status(401).json({
                    status: 'ErrorSignUp',
                    data: null,
                    message: `Sorry, the email provided is not accepted.`,
                });
            }
        }
        req.signUpUserInfo = { fname, lname, email, password, cpassword }
        next();
    } catch (error) {
        return res.status(404).json({
            status: 'ErrorSignUp',
            data: null,
            message: 'Sorry, we cannot register your informations, please verify the information you have provided.'
        });
    }
};

//=======================================
// Start validate user by token
//=======================================
const AccountValidateByTokenMiddleware = async(req, res, next) => {

    try {
        const { token } = JSON.parse(req.body.data);
        const jwToken = new jsonWebToken();

        const infoFromToken = await jwToken.VerifyToken(token);

        if (infoFromToken.tokenStatus === 'Invalid token' || !infoFromToken) {
            return res.status(404).json({
                status: 'AccountValidation',
                data: null,
                // message: 'We couln\'t verify your account, verify the information you have provided.',
                message: 'Sorry, we cannot validate your account or account does not exists <br/>please verify the information you have provided.',
            });
        }

        const getUserData = await jwToken.GetUserDataFromToken(token);
        if (!getUserData) {
            return res.status(404).json({
                status: 'AccountValidation',
                data: null,
                // message: 'We couln\'t verify your account, verify the information you have provided.',
                message: 'Sorry, we cannot validate your account or account do not exists <br/>please verify the information you have provided.',
            });
        }

        const { user, iat, exp, jti } = getUserData;

        if (
            typeof user !== 'object' ||
            typeof iat !== 'number' ||
            typeof exp !== 'number' ||
            typeof jti !== 'string') {
            //delete token from db
            await jwToken.deleteTokenById({ _id: jti, user_id: user._id });
            return res.status(404).json({
                status: 'AccountValidation',
                data: null,
                // message: 'We couln\'t verify your account, verify the information you have provided.',
                message: 'Sorry, we cannot validate your account or account do not exists <br/>please verify the information you have provided.',
            });
        }

        //{ token_id: jti, user_id: user._id, iat: iat, exp: exp,  token_type }
        const tokenRespDB = await jwToken.validateTokenFromDataBase({ _id: jti, user_id: user._id, iat: iat, exp: exp });
        if (!tokenRespDB.status || tokenRespDB.data.token_type !== 'register') {
            //delete token from db
            await jwToken.deleteTokenById({ _id: jti, user_id: user._id });

            if (infoFromToken.tokenStatus === 'Valid token') {
                return res.status(200).json({
                    status: 'ErrorAccountValidation',
                    data: null,
                    message: 'Your account already validated <br/> please go to <a href="/auth/sign-in" class="text-primary">Sign In<a>'
                });
            }
            return res.status(404).json({
                status: 'ErrorAccountValidation',
                data: null,
                message: 'Account may be validated already or account doesn\'t exists <br/> please go to <a href="/auth/sign-in" class="text-primary">Sign In<a>'
            });
        }
        // const userOnline = await AuthModel.findOne({ _id: user._id, emailVerifyAt: null, status: "I"}, '_id fname lname email');
        const userOnline = await AuthModel.findOne({ _id: user._id, deletedAt: null }, '_id fname lname email emailVerifyAt status emailCreateVerifyTokenAt emailTotalVerifyTokenSentToday');
        if (!userOnline) {
            //user does not exists and delete token from db.
            await jwToken.deleteTokenById({ _id: jti, user_id: user._id });
            return res.status(404).json({
                status: 'ErrorAccountValidation',
                data: null,
                message: 'Sorry, we cannot validate your account or account does not exists <br/>please verify the information you have provided.'
            });
        }
        const { _id, fname, lname, email, emailCreateVerifyTokenAt, emailTotalVerifyTokenSentToday } = userOnline;

        if (infoFromToken.tokenStatus === 'Token expire') {
            if (userOnline.status === 'I' && userOnline.emailVerifyAt === null) {
                /*user need a new token to validate account*/
                // 1 send email user account validate again.

                if (emailCreateVerifyTokenAt !== null && emailTotalVerifyTokenSentToday > 0) {
                    //if user acccount still not validated and try to sign in for first time
                    const respDate = moment.duration(new moment().diff(emailCreateVerifyTokenAt)).asHours();
                    if ((emailTotalVerifyTokenSentToday + 1) > EMAIL_SENDER_LIMIT && EMAIL_SENDER_TIME_LIMIT > respDate) {
                        //check if max email can be send is over and if has been less then 3 hours
                        return res.status(401).json({
                            status: 'ErrorSignIn',
                            data: null,
                            message: 'Sorry, your account exists but limit email validation execeded <br/>please try after 3 hours or verify your inbox account provider.',
                        });
                    }
                }

                let fielsdOptions = {}
                if ((emailTotalVerifyTokenSentToday + 1) > EMAIL_SENDER_LIMIT) {
                    fielsdOptions = {
                        emailCreateVerifyTokenAt: new Date(),
                        emailTotalVerifyTokenSentToday: 1
                    };
                } else {
                    fielsdOptions = {
                        emailCreateVerifyTokenAt: new Date(),
                        $inc: { emailTotalVerifyTokenSentToday: 1 }
                    };
                }

                //delete all old token from db
                await jwToken.deleteAllToken({ user_id: user._id });
                const newToken = await jwToken.tokenSignUp(SIGN_UP, { _id, fname, lname }, ACCESS_TOKEN_SECRET_KEY, req.deviceInfo.type);
                if (!newToken) {
                    //find and delete user registration by id
                    return res.status(500).json({
                        status: 'ErrorAccountValidation',
                        data: null,
                        message: 'We couln\'t send you an email account verification <br/>please try again or contact customer service',
                    });
                }
                await AuthModel.updateOne({ _id: _id }, fielsdOptions);

                //send email a new email verification
                const emailToSend = new nodeEmailSender();
                emailToSend.formatEmailValidationSender({ fname, lname, email, newToken, url: APP_FRONT_END_URL, appName: NAME_APP }, 'register', `New ${NAME_APP} account confirm registration details ✔`)
                    .then(() => {
                        return res.status(201).json({
                            status: 'success',
                            data: null,
                            message: `We sent you a new email account verification <br/> ${email} <br/> go to your inbox email provider. `
                        });
                    }).catch(err => {
                        return res.status(500).json({
                            status: 'ErrorSignUp',
                            data: null,
                            message: 'We couln\'t send you an email account verification. <br/>please try again or contact customer services.'
                        });
                    });
            }

            if (userOnline.status === 'A' && userOnline.emailVerifyAt !== null) {
                /* user account already validated */
                // 1 delete token
                await jwToken.deleteTokenById({ _id: jti, user_id: user._id });
                // 2 user allready validate.
                return res.status(201).json({
                    status: 'ErrorAccountValidation',
                    data: null,
                    message: 'Your account is already validated. <br/> you can <a href="/auth/sign-in" class="text-primary">Sign In</a> to your account',
                    redirectTo: '/auth/sign-in'
                });
            }
        }

        if (infoFromToken.tokenStatus === 'Valid token') {

            if (userOnline.status === 'A' && userOnline.emailVerifyAt !== null) {
                /* user account already validated */
                // 1 delete token
                await jwToken.deleteAllToken({ _id: user._id, token_type: { $in: ['register'] } });
                // 2 user allready validate.
                return res.status(201).json({
                    status: 'ErrorAccountValidation',
                    data: null,
                    message: 'Your account is already validated. <br/><a href="/auth/sign-in" class="text-primary">Sign In</a> to your account and enjoy ours discounts, coupons and best prices.',
                    redirectTo: '/auth/sign-in'
                });
            } else
            if (userOnline.status === 'I' && userOnline.emailVerifyAt === null) {
                req.userData = userOnline;
                next();
            } else {
                return res.status(404).json({
                    status: 'ErrorAccountValidation',
                    data: null,
                    message: 'Sorry, we cannot validate your account or account does not exists <br/>please verify the information you have provided.'
                });
            }
        }
    } catch (error) {
        return res.status(404).json({
            status: 'ErrorAccountValidation',
            data: null,
            message: 'Sorry, we cannot validate your account or account does not exists <br/>please verify the information you have provided.'
        });
    }
};

//=======================================
// Start sign in user
//=======================================
const SignInMiddleware = async(req, res, next) => {
    try {

        const { email, password } = req.body;
        await AuthValidation({ email, password }, 'login');

        if (typeof email !== 'string' || typeof password !== 'string') {
            return res.status(404).json({
                status: 'ErrorSignIn',
                data: null,
                // message: `Sorry email or password invalid.`,
                message: 'Sorry, email or password doesn\'t match',
            });
        }
        const userOnline = await AuthModel.findOne({ email: email }, '_id fname lname email emailVerifyAt status deletedAt emailTotalVerifyTokenSentToday emailCreateVerifyTokenAt');

        if (!userOnline) {
            return res.status(404).json({
                status: 'ErrorSignIn',
                data: null,
                // message: `Sorry we don't have an account registered with email <b>${email}</b>`,
                message: 'Sorry, email or password doesn\'t match',
            });
        }

        const { fname, lname, _id, emailTotalVerifyTokenSentToday, emailCreateVerifyTokenAt, deletedAt } = userOnline;

        if (deletedAt !== null) {
            return res.status(401).json({
                status: 'ErrorSignIn',
                data: null,
                message: 'Sorry, email or password doesn\'t match',
            });
        }

        if (userOnline.emailVerifyAt === null && userOnline.status === 'I') {
            // createEmailVerifyTokenAt = new Date();
            if (emailCreateVerifyTokenAt !== null && emailTotalVerifyTokenSentToday > 0) {
                //if user acccount still not validated and try to sign in for first time
                const respDate = moment.duration(new moment().diff(emailCreateVerifyTokenAt)).asHours();
                if ((emailTotalVerifyTokenSentToday + 1) > EMAIL_SENDER_LIMIT && EMAIL_SENDER_TIME_LIMIT > respDate) {
                    //check if max email can be send is over and if has been less then 3 hours
                    return res.status(401).json({
                        status: 'ErrorSignIn',
                        data: null,
                        message: 'Sorry, your account exists but limit email validation execeded <br/>please try after 3 hours or verify your inbox account provider.',
                    });
                }
            }

            // create new token end send by email
            const jwToken = new jsonWebToken();
            const newToken = await jwToken.tokenSignUp(SIGN_IN, { _id, fname, lname }, ACCESS_TOKEN_SECRET_KEY, req.deviceInfo.type);

            if (!newToken) {
                return res.status(500).json({
                    status: 'ErrorSignIn',
                    data: null,
                    message: 'We couln\'t generate your new email vefirication <br/> please contact tecnical support',
                });
            }

            let fielsdOptions = {}

            if ((emailTotalVerifyTokenSentToday + 1) > EMAIL_SENDER_LIMIT) {
                fielsdOptions = {
                    emailCreateVerifyTokenAt: new Date(),
                    emailTotalVerifyTokenSentToday: 1
                };
            } else {
                fielsdOptions = {
                    emailCreateVerifyTokenAt: new Date(),
                    $inc: { emailTotalVerifyTokenSentToday: 1 }
                };
            }

            await AuthModel.updateOne({ _id: _id, email: email }, fielsdOptions);
            const emailToSend = new nodeEmailSender();
            emailToSend.formatEmailValidationSender({ fname: fname, lname: lname, email: email, newToken, url: APP_FRONT_END_URL, appName: NAME_APP }, 'register', `New ${NAME_APP} account confirm registration details ✔`).then(() => {

                return res.status(200).json({
                    status: 'success',
                    data: null,
                    message: `We found your email account registered but is not verify and we sent you a new email account verification <br/> <b>${email}</b> <br/> go to your email inbox provider to validate your account.`
                });
            }).catch(err => {
                console.log("err", err)
                return res.status(500).json({
                    status: 'ErrorSignIn',
                    data: null,
                    message: 'We couln\'t send you an email account verification. please try again or contact customer services.'
                });
            });


        } else if (userOnline.emailVerifyAt !== null && userOnline.status === 'A') {
            userOnline.userPassword = password;
            req.userInfo = userOnline;
            next();
        } else {
            return res.status(401).json({
                status: 'ErrorSignIn',
                data: null,
                message: 'Sorry, email or password doesn\'t match',
            });
        }
    } catch (error) {
        console.log("SignInMiddleware -> error", error)
        return res.status(404).json({
            status: 'ErrorSignIn',
            data: null,
            message: 'Sorry, we cannot register your informations, please verify the information you have provided.'
        });
    }
};
//=======================================
// Start varify if token is valid by jwt
//=======================================


const TokenRefreshMiddleware = async(req, res, next) => {

    try {
        // let token = req.params.token || req.body.token || req.headers.authorization || req.cookies.__SID;
        const token = req.cookies.__SID;
        if (!token) {
            //token is undefined
            return res.status(404).json({
                success: false,
                data: null,
                message: '',
            });
        }

        const jwToken = new jsonWebToken();
        const infoFromToken = await jwToken.VerifyToken(token);
        if (infoFromToken.tokenStatus === 'Invalid token' || !infoFromToken) {
            return res.status(404).json({
                status: 'TokenRefresher',
                data: null,
                message: '',
            });
        }

        const getUserData = await jwToken.GetUserDataFromToken(token);
        if (!getUserData) {

            return res.status(401).json({
                success: false,
                data: null,
                message: '',
            });
        }

        const { user, iat, exp, jti } = getUserData;
        //validate data with formik

        if (
            typeof user !== 'object' ||
            typeof iat !== 'number' ||
            typeof exp !== 'number' ||
            typeof jti !== 'string') {
            //delete token from db
            await jwToken.deleteTokenById({ token_id: jti, user_id: user._id });
            return res.status(404).json({
                success: false,
                data: null,
                message: '',
            });
        }

        //{ token_id: jti, user_id: user._id, iat: iat, exp: exp,  token_type }
        const tokenRespDB = await jwToken.validateTokenFromDataBase({ token_id: jti, user_id: user._id, iat: iat, exp: exp });
        if (!tokenRespDB.status || typeof tokenRespDB.data.token_type !== 'string' || tokenRespDB.data.token_type !== 'login') {
            //delete token from db
            await jwToken.deleteTokenById({ token_id: jti, user_id: user._id });
            //redirect user in front end to sign-in page
            return res.status(307).json({
                success: false,
                data: null,
                message: ''
            });
        }
        // const userOnline = await AuthModel.findOne({ _id: user._id, emailVerifyAt: null, status: "I"}, '_id fname lname email');
        const userOnline = await AuthModel.findOne({ _id: user._id, status: 'A', deletedAt: null }, '_id fname lname email status createdAt');

        if (!userOnline) {
            //user does not exists and delete token from db.
            await jwToken.deleteTokenById({ token_id: jti, user_id: user._id });
            return res.status(404).json({
                success: false,
                data: null,
                message: 'Sorry, we cannot validate your account or account does not exists <br/>please verify the information you have provided.'
            });
        }

        if (infoFromToken.tokenStatus === 'Valid token') {
            return res.status(202).json({
                success: true,
                data: null,
                message: ''
            });
        }
        if (infoFromToken.tokenStatus === 'Token expire') {
            req.userDataInf = {
                userOnline,
                jti
            };
            next();
        } else {
            return res.status(404).json({
                success: false,
                data: null,
                message: ''
            });
        }
    } catch (error) {
        return res.status(404).json({
            status: 'ErrorAccountValidation',
            data: null,
            message: 'Sorry, we cannot validate your account or account does not exists <br/>please verify the information you have provided.'
        });
    }
};


const validatorToken = async(payload, token_type) => {
    const jwToken = new jsonWebToken();
    // const { user, iat, exp, jti } = await jwToken.GetUserDataFromToken(token);

    const { user, iat, exp, jti } = payload;

    return await jwToken.tokenValidateDataBase({ token_id: jti, iat: iat, exp: exp, user_id: user._id, token_type });
};

const verifyIfEmailAndPhoneExistsMiddleware = async(req, res, next) => {

    try {
        const buff = new Buffer.from(req.query.uaid, 'base64');
        const decoded = buff.toString('utf-8');
        const { email, phone } = JSON.parse(decoded);
        await AuthValidation({ email, phone }, 'emailAndPhoneOnly');

        const userData = await AuthModel.findOne({ email, phone, status: 'A', deletedAt: null, phoneVerifyAt: { $exists: true, $ne: null }, emailVerifyAt: { $exists: true, $ne: null } }, '_id fname lname email emailVerifyAt emailCreateVerifyTokenAt emailTotalVerifyTokenSentToday phone phoneCreatedVerifyCodeAt phoneTotalSmsVerifySent');
        if (!userData) {
            return res.status(404).json({
                status: 'OTP',
                message: 'We have an issue, Please try again.33',
            });
        }
        req.userData = userData;
        next();
    } catch (error) {
        return res.status(400).json({
            status: 'ErrorOTP',
            response: null,
            message: 'We have an issue, Please try again.',
        });
    }
}

const AccountForgotPasswordMiddleware = async(req, res, next) => {
    // console.log("AccountForgotPasswordMiddleware -> email", email)
    try {
        const email = req.body.email;
        await AuthValidation({ email }, 'forgotpw');
        // const userData = await AuthModel.findOne({ email: { $or: [{ email: email, phone: email }] }, status: 'A', emailVerifyAt: { $exists: true, $ne: null } }, '_id email emailVerifyAt status fname lname emailCreateVerifyTokenAt emailTotalVerifyTokenSentToday');
        // const userData = await AuthModel.findOne({ $or: [{ email: { $eq: email }, phone: { $eq: email } }] }, '_id email emailVerifyAt status fname lname emailCreateVerifyTokenAt emailTotalVerifyTokenSentToday');
        // const userData = await AuthModel.findOne({ status: 'A', emailVerifyAt: { $exists: true, $ne: null }, $or: [{ email: email }, { phone: email }] }, '_id email emailVerifyAt status fname lname emailCreateVerifyTokenAt emailTotalVerifyTokenSentToday');
        const userData = await AuthModel.findOne({ email, status: 'A', deletedAt: null, emailVerifyAt: { $exists: true, $ne: null } }, '_id phone email emailVerifyAt status fname lname emailCreateVerifyTokenAt emailTotalVerifyTokenSentToday phoneCreatedVerifyCodeAt phoneTotalSmsVerifySent');

        // verify token sent today amount

        if (!userData) {
            return res.status(400).json({
                status: 'ErrorForgotPassword',
                response: null,
                message: 'The email address provided is not assigned to any user account.',
            });
        }
        req.userData = userData;
        next();
    } catch (error) {
        return res.status(401).json({
            status: 'ErrorForgotPassword',
            data: null,
            // message: 'Sorry, we cannot find your account, please verify the information you have provided.'
            message: 'We ran into a problem. Please try again.'
        });
        //We ran into a problem. Please try again.
    }
};


const accountResetPasswordMiddleware = async(req, res, next) => {

    const messageErr = 'Sorry, we ran into a problem. Please try again or Start your <a href="/auth/recovery" class="text-primary">password recovery</a> proccess again.';
    try {
        const { password, email, phone, code, tk: token } = req.body;
        //miss phone validation
        //not realy need
        let unFilterData = null,
            hasPhoneValidation = false,
            token_id = null,
            queryDb = {
                status: 'A',
                email,
                deletedAt: null
            };

        if (token) {
            // get token info validations
            const jwToken = new jsonWebToken();
            const infoFromToken = await jwToken.VerifyToken(token);
            if (!infoFromToken || infoFromToken.tokenStatus !== 'Valid token') {
                return res.status(404).json({
                    status: 'ResetPassword',
                    data: null,
                    // message: 'We couln\'t verify your account, verify the information you have provided.',
                    message: messageErr
                });
            }

            const getUserData = await jwToken.GetUserDataFromToken(token);
            if (!getUserData) {
                return res.status(404).json({
                    status: 'ResetPassword',
                    data: null,
                    // message: 'We couln\'t verify your account, verify the information you have provided.',
                    message: messageErr
                });
            }

            const { user, iat, exp, jti } = getUserData;
            if (
                typeof user !== 'object' ||
                typeof iat !== 'number' ||
                typeof exp !== 'number' ||
                typeof jti !== 'string') {
                //delete token from db
                await jwToken.deleteTokenById({ _id: jti, user_id: user._id });
                return res.status(401).json({
                    status: 'ResetPassword',
                    data: null,
                    // message: 'We couln\'t verify your account, verify the information you have provided.',
                    message: messageErr
                });
            }
            //{ token_id: jti, user_id: user._id, iat: iat, exp: exp,  token_type }
            let tokenRespDB = await jwToken.validateTokenFromDataBase({ _id: jti, user_id: user._id, iat: iat, exp: exp });
            if (!tokenRespDB.status || tokenRespDB.data.token_type !== 'recoveryAccount') {
                //delete token from db
                await jwToken.deleteTokenById({ _id: jti, user_id: user._id });
                return res.status(401).json({
                    status: 'ResetPassword',
                    data: null,
                    message: messageErr
                });
            }

            // set user data to check for query

            // set from email
            unFilterData = {
                password,
                email: user.email,
                _id: user._id
            }
            hasPhoneValidation = false;
            token_id = jti;
        }

        // validate by user data
        if (!token && email && phone && code && password) {
            unFilterData = {
                password,
                phone,
                phoneCode: code,
                email
            };
            //set from phone phone && code && password && email
            queryDb = {
                ...queryDb,
                phone,
                phoneVerifyCode: code,
                phoneVerifyAt: { $exists: true, $ne: null }
            }
            hasPhoneValidation = true;
        }

        await AuthValidation(unFilterData, hasPhoneValidation === true ? 'emailPhonePhoneCodePass' : 'emailAndPasswordOnly');
        // const userData = await AuthModel.findOne({ email: email, status: 'A', phone, phoneVerifyCode: code, phoneVerifyAt: { $exists: true, $ne: null }, emailVerifyAt: { $exists: true, $ne: null } }, '_id email emailVerifyAt status fname lname emailCreateVerifyTokenAt emailTotalVerifyTokenSentToday');
        const userData = await AuthModel.findOne(queryDb, '_id email fname lname password phoneCreatedVerifyCodeAt phoneTotalSmsVerifySent emailCreateVerifyTokenAt emailTotalVerifyTokenSentToday');
        if (!userData) {
            return res.status(404).json({
                status: 'ResetPassword',
                response: null,
                message: messageErr
            });
        }

        const { phoneCreatedVerifyCodeAt } = userData;
        const dateVPhone = new moment.duration(new moment().diff(new moment(phoneCreatedVerifyCodeAt))).asHours();
        if (email && phone && code && dateVPhone > PHONE_OTP_TIME_LIMIT) {
            // validate date and time emaited phone code
            return res.status(404).json({
                status: 'ResetPassword',
                response: null,
                message: messageErr,
            });
        }
        req.userData = {
            userData,
            password,
            token_id: token_id
        };
        next();
        // return res.status(500).json({
        //     status: 'ResetPassword',
        //     response: null,
        //     message: messageErr,
        // });
    } catch (error) {
        console.log("Sorry your password doesn\' mactch. -> error", error);
        return res.status(401).json({
            status: 'ErrorResetPassword',
            data: null,
            message: messageErr
        });
    }
}

const googleSignUpMiddleware = (req, res, next) => {



    return res.status(404).json({
        status: 'success',
        response: null,
        message: 'google +++',
    });
    // next();
}

module.exports = {
    SignUpMiddleware,
    SignInMiddleware,
    AccountValidateByTokenMiddleware,
    TokenRefreshMiddleware,
    AccountForgotPasswordMiddleware,
    verifyIfEmailAndPhoneExistsMiddleware,
    accountResetPasswordMiddleware,
    googleSignUpMiddleware
};