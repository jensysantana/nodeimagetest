'use strict';
const express = require('express');
const app = express(),
    GlobalHelpers = require('../../helpers/global-helpers'),
    _ = require('underscore'),
    nodeEmailSender = require('../../helpers/NodeEmail'),
    jsonWebToken = require('../../helpers/jsonwebtoken');
const moment = require('moment');
// let { routerHelper } = require('../routeHelpers/routerHelper');
// let { validations }  = require('../../validations/validations.index');
// const logoutMD = require('../middlewares/logoutMiddleware');

const { AuthModel, PasswordRecoveryBackup } = require('../../models/Auth/Auth');
const {
    SignInMiddleware,
    AccountValidateByTokenMiddleware,
    SignUpMiddleware,
    TokenRefreshMiddleware,
    AccountForgotPasswordMiddleware,
    verifyIfEmailAndPhoneExistsMiddleware,
    accountResetPasswordMiddleware,
    googleSignUpMiddleware
} = require('../../middlewares/AuthMiddlewares/SignInUpMiddleware');
const {
    // tokenConfigs, appConf, frontEnd 
    TOKEN: { SIGN_UP, SIGN_IN, ACCESS_TOKEN_SECRET_KEY },
    APP: { APP_FRONT_END_URL, NAME_APP },
    ISPRODUCTION_ENV,
    BLOCK_OPT_OR_EMAIL_SENDER_TIME: {
        EMAIL_SENDER_LIMIT,
        EMAIL_SENDER_TIME_LIMIT,
        PHONE_OTP_LIMIT,
        PHONE_OTP_TIME_LIMIT
    }

} = require('../../../config/config');
const SMSSender = require('../../helpers/sms-sender');
/**/
const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
    /*
    const formtEmailSender = async ({ fname, lname, email, newToken, url, appName }) => {
        let html = `
                <div>
                    <h3 class="suheader">Dear ${fname} ${lname}</h3>
                    <p class="title">Congratulations on your new account ${email}</p>
                    <div style="min-width: 100%; display: flex; flex-direction: row; justify-content: center; flex-basis: 100%; height: auto;">
                        <section style="margin: 0 auto;text-align: center;">
                            <h3 style="font-family:'AvenirNext',Arial,sans-serif;font-size:25px;line-height:33px;color:#626262;letter-spacing:2px">${appName}</h3>
                            <p>Hi There.</p>
                            <p>Please <a href="${url}/account-validate/${newToken}" target="_blank">confirm</a> your email address</p>
                            <a style="display: inline-block; text-decoration-line: none; font-size: 24px; background-color: #35ad9ac2; padding: 10px; border:0px; border-radius: 15px; color: #fff; margin: 10px 0 10px 0; cursor:pointer" href="${url}/account-validate/${newToken}" target="_blank">Click me to confirm your account</a>
                            <p>Once your account is confirmed, you’ll be officially ready to login and enjoy our system</p>
                            <p >Thank you for using <a target="_blank" href="${url}"\>${appName}</a></p>
                        </section>
                    </div>
                </div>
            `;

        let emailToSend = new nodeEmailSender();
        let emailData = {
            name: `${fname} ${lname}`,
            to: email,
            html: html,
            subject: 'Confirm registration details ✔',
        };
        return await emailToSend.main(emailData);

        // emailToSend.main(emailData).then(() => {
        //     // console.log('email sent');
        //     // console.log('email sent');
        //     return res.status(200).json({
        //         status: 'success',
        //         data: null,
        //         message: `We sent you an email account verification. to ${email}.`
        //     });
        // }).catch(err => {
        //     return res.status(500).json({
        //         status: 'ErrorSignUp',
        //         data: null,
        //         message: 'Oops! we couln\'t send you an email account verification. please try again or contact customer services.'
        //     });
        // });
    }
    */
    //=====================================
    // Start signUp 
    //=====================================
app.post('/signup', [SignUpMiddleware], async(req, res) => {
    let userDataStored = null;
    try {
        const helpers = new GlobalHelpers();
        const { fname, lname, email, password } = req.signUpUserInfo;

        const userOnline = await AuthModel.create({
            fname: fname,
            lname: lname,
            email: email,
            password: await helpers.encrypPassword(password),
            authorization_code: `${Math.floor(100000 + Math.random() * 900000)}-${new Date().getTime().toString().slice(3)}`
        })

        userDataStored = _.pick(userOnline, ['_id', 'fname', 'lname']);
        const token = new jsonWebToken();
        const newToken = await token.tokenSignUp(SIGN_UP, userDataStored, ACCESS_TOKEN_SECRET_KEY, req.deviceInfo.type);

        if (!newToken) {
            //find and delete user registration by id
            await AuthModel.findByIdAndDelete({ _id: userDataStored._id });
            return res.status(500).json({
                status: 'ErrorSignUp',
                data: null,
                message: 'We couln\'t send you an email account verification, please try again',
            });
        }

        const emailToSend = new nodeEmailSender();
        // emailToSend.formatEmailValidationSender({ fname, lname, email, newToken, url: APP_FRONT_END_URL, appName: NAME_APP }, 'register', `${NAME_APP} confirm registration details ✔`)
        emailToSend.signUp({ fname, lname, email, url: APP_FRONT_END_URL, appName: NAME_APP, newToken }, `${NAME_APP} confirm registration details ✔`)
            .then(() => {
                return res.status(200).json({
                    status: 'success',
                    data: null,
                    message: `We sent you an email account verification <br/> ${email}`
                });
            }).catch(err => {
                return res.status(500).json({
                    status: 'ErrorSignUp',
                    data: null,
                    message: 'We couln\'t send you an email account verification. <br/>please try again or contact customer services.'
                });
            });
        // return res.status(200).json({
        //     data: null,
        //     success: false,
        //     message: `We sent you an email account verification. to.`
        // });
    } catch (error) {
        if (error.errors && error.errors.hasOwnProperty('email')) {
            if (error.errors.email.properties.type === 'unique') {
                const err = error.errors.email.properties;
                return res.status(401).json({
                    status: 'ErrorSignUp',
                    data: null,
                    message: `${err.message} ${err.value}`
                });
            }
        }
        return res.status(400).json({
            status: 'ErrorSignUp',
            data: null,
            message: 'Sorry, we cannot register your informations, please verify the information you have provided.'
        });
    }
});
//just need to verify the token
app.post('/account-validate-by-token', [AccountValidateByTokenMiddleware], async(req, res) => {
    //=====================================
    // 1 VERIFY USER ACCOUNT EMAIL
    //=====================================
    try {
        const { _id } = req.userData;
        const userFound = await AuthModel.findOneAndUpdate({ _id: _id }, { $set: { status: "A", emailTotalVerifyTokenSentToday: 0, emailVerifyAt: new Date() } });
        if (!userFound) {
            return res.status(401).json({
                status: 'ErrorValidatorAccount',
                data: null,
                message: 'Sorry, we cannot validate your account or account do not exists, please verify the information you have provided.'
            });
        }

        const { fname, lname, email } = userFound;
        const emailToSend = new nodeEmailSender();
        const jsonToken = new jsonWebToken();
        // emailToSend.formatEmailValidationSender({ fname, lname, email, newToken: null, url: APP_FRONT_END_URL, appName: NAME_APP }, 'thanks', `Your ${NAME_APP} account has been validate successfully ✔`)
        emailToSend.signUpFeedBack({ fname, lname, email, url: APP_FRONT_END_URL, appName: NAME_APP }, `Your ${NAME_APP} account has been validate successfully ✔`)
            .then(async() => {
                // Delete token all token user can have in token store.
                await jsonToken.deleteAllToken({ user_id: _id });
                await AuthModel.findOneAndUpdate({ _id: _id }, { $set: { status: "A", emailVerifyAt: new Date() } });
                return res.status(200).json({
                    status: 'success',
                    data: null,
                    message: `Your account has been validate successfully. <br/><a href="/auth/sign-in" class="text-primary">Sign In</a> to enjoy our offers, coupons and best prices. <br/> <b>${email}</b>`,
                });

            }).catch(async(err) => {
                await AuthModel.findOneAndUpdate({ _id: _id }, { $set: { status: "I", emailTotalVerifyTokenSentToday: 0, emailVerifyAt: null } });
                console.log("err", err);
                return res.status(401).json({
                    status: 'ErrorValidatorAccount',
                    data: null,
                    message: 'Oops! something happen, your account can not be verify. <br/>please try again or contact customer services.'
                });
            });
    } catch (error) {
        await AuthModel.findOneAndUpdate({ _id: _id }, { $set: { status: "I", emailTotalVerifyTokenSentToday: 0, emailVerifyAt: null } });
        console.log("error", error);
        //send email to user if exist
        return res.status(404).json({
            status: 'ErrorValidatorAccount',
            data: null,
            message: 'Oops! something happen, your account can not be verify. <br/>please try again or contact customer services.'
                // message: 'Oops! something happen please contact customer service'
        });
    }
});

//=====================================
// Start login
//=====================================
app.post('/sign-in', [SignInMiddleware], async(req, res) => {

    try {
        const { _id, userPassword } = req.userInfo;

        //delete cookie
        // res.status(202).clearCookie('CookieName').send('cookie delete');

        const userOnlineN = await AuthModel.findOne({ _id, status: "A", deletedAt: null, emailVerifyAt: { $exists: true, $ne: null } });

        if (!userOnlineN) {
            return res.status(401).json({
                status: 'ErrorSignIn',
                data: null,
                // message: `Sorry, we cannot find your account ${email}. if you sure have registered already, may you need to validate your account, just check in your email address inbox for an email verification.`,
                message: 'Sorry, email or password doesn\'t match',
            });
        }

        //validate password
        const helpers = new GlobalHelpers();
        const respBcryp = await helpers.bcryptCheckUser(userPassword, userOnlineN.password);
        if (!respBcryp) {
            return res.status(401).json({
                status: 'ErrorSignIn',
                data: null,
                message: 'Sorry, email or password doesn\'t match',
            });
        }

        const userDataStored = _.pick(userOnlineN, ['_id', 'fname', 'lname', 'phone', 'email', 'createdAt', 'is_vendor']);
        const token = new jsonWebToken();
        const newToken = await token.tokenSignIn(SIGN_IN, userDataStored, ACCESS_TOKEN_SECRET_KEY, req.deviceInfo.type);

        if (!newToken) {
            return res.status(500).json({
                status: 'ErrorSignIn',
                data: null,
                message: 'Oops! we couln\'t find your account verification, please try again',
            });
        }

        if (userOnlineN.emailTotalVerifyTokenSentToday > 0) {
            await AuthModel.findByIdAndUpdate({ _id: _id }, { $set: { emailTotalVerifyTokenSentToday: 0 } })
        }

        const buf = Buffer.from(JSON.stringify(userDataStored), 'utf8');
        const encodedData = buf.toString('base64');

        let d = new Date();
        // d.setTime(d.getTime() + (1 * 24 * 60 * 60 * 1000));
        d.setTime(d.getTime() + (20 * 60 * 1000));
        const options = {
            // expires: new Date(new Date().getTime() + 5 * 1000),
            // maxAge: 1000 * 60 * 15, // would expire after 15 minutes
            sameSite: 'strict',
            path: '/',
            expires: d,
            httpOnly: true, // The cookie only accessible by the web server
            secure: ISPRODUCTION_ENV, // Indicates if the cookie should be signed
        };
        return res.status(200)
            .cookie(
                '__SID',
                newToken, options
            ).send({
                // ck: 'cookie being initialised',
                userInfo: encodedData,
                redirectTo: '/',
                message: ''
            });
    } catch (error) {
        return res.status(400).json({
            status: 'ErrorSignIn',
            data: null,
            message: 'Sorry, we cannot find your informations, please verify the information you have provided.'
        });
    }
});

//REFRESH TOKEN
app.post('/refresh-token', [TokenRefreshMiddleware], async(req, res) => {

    let userInf = req.userDataInf;
    // let token = req.params.token || req.body.token || req.headers.authorization || req.cookies.__SID;.
    /*
    let token = req.cookies.__SID;

    */
    const userToken = _.pick(userInf.userOnline, ['_id', 'fname', 'lname', 'email', 'createdAt', 'status']);
    let token = new jsonWebToken();

    const newToken = await token.tokenRefresher(SIGN_IN, userToken, ACCESS_TOKEN_SECRET_KEY, req.deviceInfo.type);
    if (!newToken) {
        return res.status(401).json({
            status: 'ErrorTokenRefresher',
            response: null,
            message: 'The token is invalid.',
        });
    }
    return res.status(200).json({
        status: 'success',
        response: newToken,
        message: 'token refreshed.',
    });
});

app.get('/recovery-from-phone', [verifyIfEmailAndPhoneExistsMiddleware], async(req, res) => {
    try {
        const userData = req.userData;
        const gHelpers = new GlobalHelpers();

        const {
            _id,
            emailCreateVerifyTokenAt,
            emailTotalVerifyTokenSentToday,
            phone,
            email,
            phoneCreatedVerifyCodeAt,
            fname,
            lname,
            phoneTotalSmsVerifySent
        } = userData;

        //verify if user block by email to request password reset
        if (emailCreateVerifyTokenAt && emailTotalVerifyTokenSentToday > 0) {
            //if user acccount still not validated and try to sign in for first time
            const respDate = moment.duration(new moment().diff(new moment(emailCreateVerifyTokenAt))).asHours();
            if (emailTotalVerifyTokenSentToday >= EMAIL_SENDER_LIMIT && EMAIL_SENDER_TIME_LIMIT > respDate) {
                //check if max email can be send is over and if has been less then 3 hours
                return res.status(401).json({
                    status: 'ErrorOTP',
                    data: null,
                    message: `We have an issue, Please try again after ${EMAIL_SENDER_TIME_LIMIT} hours`,
                });
            }
        }

        //verify if user block by phone number to request password reset
        if (phoneCreatedVerifyCodeAt && phoneTotalSmsVerifySent > 0) {
            //if user acccount still not validated and try to sign in for first time
            const respDate = moment.duration(new moment().diff(new moment(phoneCreatedVerifyCodeAt))).asHours();
            if (phoneTotalSmsVerifySent >= PHONE_OTP_LIMIT && PHONE_OTP_TIME_LIMIT > respDate) {
                //check if max phone otp can be send is over and if has been less then 3 hours
                return res.status(401).json({
                    status: 'ErrorOTP',
                    data: null,
                    message: `We have an issue, Please try again after ${PHONE_OTP_TIME_LIMIT} hours`,
                });
            }
        }

        // const respDate = new moment(phoneCreatedVerifyCodeAt).isBefore(new Date());


        // generate code to send
        const recoverCode = await gHelpers.GenerateStringRandom(6, 'num');
        let fielsdOptions = {}
        if (!phoneTotalSmsVerifySent && !phoneCreatedVerifyCodeAt) {
            // set token to 1 if is first time requesting sms or if request was date before
            fielsdOptions = {
                $set: {
                    phoneCreatedVerifyCodeAt: new Date(),
                    phoneVerifyCode: recoverCode,
                    phoneTotalSmsVerifySent: 1
                },
            };
        }

        // reset the DB counter to 1
        if (phoneTotalSmsVerifySent && phoneCreatedVerifyCodeAt) {
            const respDate = new moment.duration(new moment().diff(new moment(phoneCreatedVerifyCodeAt))).asHours();
            if (respDate >= PHONE_OTP_TIME_LIMIT) {
                //(phoneTotalSmsVerifySent + 1) >= PHONE_OTP_LIMIT &&
                fielsdOptions = {
                    $set: {
                        phoneCreatedVerifyCodeAt: new Date(),
                        phoneVerifyCode: recoverCode,
                        phoneTotalSmsVerifySent: 2
                    },
                };
            }

            if (PHONE_OTP_TIME_LIMIT > respDate) {
                fielsdOptions = {
                    $set: {
                        phoneCreatedVerifyCodeAt: new Date(),
                        phoneVerifyCode: recoverCode
                    },
                    $inc: { phoneTotalSmsVerifySent: 1 }
                };
            }
        }

        // transform to base64
        const base64Code = await gHelpers.stringToBase64(JSON.stringify({
            email: email,
            phone: phone,
            code: recoverCode
        }));

        //send sms
        const smsSender = new SMSSender();
        await smsSender.twilioSMSSender({
            body: `Your ${APP_FRONT_END_URL} verification code: ${recoverCode} \nDo not shared with anyone.`,
            to: phone, // Text this number
            from: '+15022153924' // From a valid Twilio number
        });

        // update user code sentCount DB
        await AuthModel.updateOne({ _id, phone, email }, fielsdOptions);

        // send email address notification password reset phone code has been send successfully.
        const emailToSend = new nodeEmailSender();
        emailToSend.accountRequestRecoveryFromPhone({ fname, lname, email, phone, url: APP_FRONT_END_URL, appName: NAME_APP }, `${NAME_APP} - Reset password account request`).then(() => {
            return res.status(200).json({
                status: 'success',
                response: base64Code,
                message: `We sent an email password recovery successfully.`
                    // message: `We sent an email password recovery to ${email} successfully.`
            });
        }).catch(err => {
            // console.log('---------err---------');
            // console.log(err);
            // console.log('---------err---------');
            return res.status(500).json({
                status: 'ErrorErrorForgotPassword',
                data: null,
                message: 'We couln\'t send you an email account password recovery. please try again or contact customer services.'
            });
        });
    } catch (error) {
        // console.log("error", error)
        return res.status(400).json({
            status: 'ErrorOTP',
            response: null,
            message: `We have an issue, Please try again. ERROR`,
        });
    }
});

app.post('/recovery-password-from-email', [AccountForgotPasswordMiddleware], async(req, res) => {
    const userData = req.userData;
    const gHelpers = new GlobalHelpers();

    try {
        const {
            _id,
            email,
            emailVerifyAt,
            phone,
            fname,
            lname,
            emailCreateVerifyTokenAt,
            emailTotalVerifyTokenSentToday,
            phoneCreatedVerifyCodeAt,
            phoneTotalSmsVerifySent
        } = userData;

        //==============================
        // Start if token date is < of today
        // set emailTotalVerifyTokenSentToday to 1
        // if same date and emailTotalVerifyTokenSentToday < 4
        // send validatation email
        //==============================

        //verify if user block by email to request password reset
        if (emailCreateVerifyTokenAt !== null && emailTotalVerifyTokenSentToday > 0) {
            //if user acccount still not validated and try to sign in for first time
            const respDate = moment.duration(new moment().diff(new moment(emailCreateVerifyTokenAt))).asHours();
            if (emailTotalVerifyTokenSentToday >= EMAIL_SENDER_LIMIT && EMAIL_SENDER_TIME_LIMIT > respDate) {
                //check if max email can be send is over and if has been less then 3 hours
                return res.status(401).json({
                    status: 'RecoverPassFromEmail',
                    data: null,
                    message: `We have an issue, Please try again after ${EMAIL_SENDER_TIME_LIMIT} hours`,
                });
            }
        }

        //verify if user block by phone number to request password reset
        if (phoneCreatedVerifyCodeAt !== null && phoneTotalSmsVerifySent > 0) {
            //if user acccount still not validated and try to sign in for first time
            const respDate = moment.duration(new moment().diff(new moment(phoneCreatedVerifyCodeAt))).asHours();
            if (phoneTotalSmsVerifySent >= PHONE_OTP_LIMIT && PHONE_OTP_TIME_LIMIT > respDate) {
                //check if max phone otp can be send is over and if has been less then 3 hours
                return res.status(401).json({
                    status: 'RecoverPassFromEmail',
                    data: null,
                    message: `We have an issue, Please try again after ${PHONE_OTP_TIME_LIMIT} hours`,
                });
            }
        }

        // set email to 1 if is first time requesting email or if request was date before
        let fielsdOptions = {}
        if (!emailTotalVerifyTokenSentToday && !emailCreateVerifyTokenAt) {
            //(emailTotalVerifyTokenSentToday + 1) >= PHONE_OTP_LIMIT &&
            fielsdOptions = {
                $set: {
                    emailCreateVerifyTokenAt: new Date(),
                    emailTotalVerifyTokenSentToday: 1
                }
            };
        }
        if (emailCreateVerifyTokenAt && emailTotalVerifyTokenSentToday > 0) {
            const respDate = new moment.duration(new moment().diff(new moment(emailCreateVerifyTokenAt))).asHours();
            if (respDate >= EMAIL_SENDER_TIME_LIMIT) {
                //(emailTotalVerifyTokenSentToday + 1) >= PHONE_OTP_LIMIT &&
                fielsdOptions = {
                    $set: {
                        emailCreateVerifyTokenAt: new Date(),
                        emailTotalVerifyTokenSentToday: 1
                    }
                };
            }
            if (EMAIL_SENDER_TIME_LIMIT > respDate) {
                fielsdOptions = {
                    $set: {
                        emailCreateVerifyTokenAt: new Date()
                    },
                    $inc: { emailTotalVerifyTokenSentToday: 1 }
                };
            }
        }
        //==============================
        // End if token date is < of today
        // set emailTotalVerifyTokenSentToday to 1
        // if same date and emailTotalVerifyTokenSentToday < 4
        // send validatation email
        //==============================

        // create new token end send by email
        const jwToken = new jsonWebToken();
        const newToken = await jwToken.tokenRecoveryAccount(SIGN_UP, { _id, email, fname, lname }, ACCESS_TOKEN_SECRET_KEY, req.deviceInfo.type);
        if (!newToken) {
            return res.status(404).json({
                status: 'RecoverPassFromEmail',
                data: null,
                message: 'We couln\'t verify your account, verify the information you have provided.',
            });
        }

        // await AuthModel.updateOne({ _id }, { $set: { emailTotalVerifyTokenSentToday: emailTotalSent, emailCreateVerifyTokenAt: new Date() } });
        // update user code sentCount DB
        await AuthModel.updateOne({ _id, phone, email }, fielsdOptions);
        const base64Code = await gHelpers.stringToBase64(JSON.stringify({
            email: email,
            phone: phone
        }));
        // ✔
        const emailToSend = new nodeEmailSender();
        emailToSend.accountRequestRecoveryFromEmail({ fname, lname, email, url: APP_FRONT_END_URL, appName: NAME_APP, newToken }, `${NAME_APP} - Reset password account request`)
            .then(() => {
                return res.status(200).json({
                    status: 'success',
                    response: base64Code,
                    message: `We sent an email password recovery successfully.`
                        // message: `We sent an email password recovery to ${email} successfully.`
                });
            }).catch(err => {
                return res.status(500).json({
                    status: 'RecoverPassFromEmail',
                    data: null,
                    message: 'We couln\'t send you an email account password recovery. please try again or contact customer services.'
                });
            });
    } catch (error) {
        // console.log("error", error)
        return res.status(400).json({
            status: 'RecoverPassFromEmail',
            response: null,
            message: `Error, the email: ${userData.email} is in valid.`,
        });
    }
});
// app.post('/password-reset', [validations.Validate(validations.AuthValidation('resetPass')), mdAuth.TokenVerifyAndGetUserVerified(true)], routerHelper(async (req, res)=>{

app.post('/reset-password-recovery', [accountResetPasswordMiddleware], async(req, res) => {
    //=====================================
    // 2 PROCESS USER RESET PASSWORD
    //=====================================

    try {

        const {
            emailVerifyAt,
            emailCreateVerifyTokenAt,
            emailTotalVerifyTokenSentToday,
            _id,
            fname,
            lname,
            email,
            phone,
            password: dbPassword
        } = req.userData.userData;

        const {
            password,
            token_id
        } = req.userData;

        // verify if user has use this password before
        //validate password
        const helpers = new GlobalHelpers();
        let respBcryp = await helpers.bcryptCheckUser(password, dbPassword);
        let passBackup = await PasswordRecoveryBackup.find({ user_id: _id });
        for (const item of passBackup) {
            const itmResp = await helpers.bcryptCheckUser(password, item.password);
            if (itmResp) {
                respBcryp = true;
                break;
            }
        }
        if (respBcryp) {
            return res.status(401).json({
                status: 'ResetPassword',
                data: null,
                message: 'Sorry, the password you trying to set may have already been used previously. Try a different password.',
            });
        }
        await PasswordRecoveryBackup.create({ user_id: _id, password: dbPassword });
        const userDataStored = await AuthModel.findOneAndUpdate({ _id }, { $set: { password: await helpers.encrypPassword(password), phoneVerifyCode: null } }, { useFindAndModify: false });
        // userDataStored = _.pick(userDataStored, ['_id', 'fname', 'lname', 'email']);
        // const jwToken = new jsonWebToken();

        console.log('---------token_id---------');
        console.log(userDataStored);
        console.log('---------token_id---------');
        // if (token_id) {
        //     await jwToken.deleteTokenById(token_id, _id);
        // }

        // return res.status(404).json({
        //     status: 'ErrorResetPassword',
        //     data: null,
        //     message: 'Sorry, we cannot verify your account. mi mujer ana julia polo cabrera.'
        // });

        // Delete token all token user can have in token store.
        const jsonToken = new jsonWebToken();
        await jsonToken.deleteAllToken({ user_id: _id });
        //=============================================
        // Send email after password reset to old users 
        //=============================================
        let emailToSend = new nodeEmailSender();
        // accountRecoveredFromPhone({ fname, lname, email, url, appName }, subject)
        emailToSend.accountRecoveredFeedBack({ fname: userDataStored.fname, lname: userDataStored.lname, email, url: APP_FRONT_END_URL, appName: NAME_APP }, `${NAME_APP} - account password has been changed`)
            .then(() => {
                // console.log('email sent');
                // console.log(data);
                // console.log('email sent');
                return res.status(200).json({
                    status: 'success',
                    data: null,
                    message: `Your password account ${email} has been changed successfully.`
                });
            }).catch(err => {
                console.log("err", err)
                return res.status(500).json({
                    status: 'ErrorResetPassword',
                    data: null,
                    message: 'We couln\'t respond to your request.'
                });
            });

        // return res.status(200).json({
        //     status: 'success',
        //     response: null,
        //     message: 'password-reset',
        // });
    } catch (error) {
        console.log("error", error)
        return res.status(404).json({
            status: 'ResetPassword',
            data: null,
            message: 'Sorry, we cannot verify your account.'
        });
    }
});

app.post('/google-sign-up', [googleSignUpMiddleware], async(req, res) => {

    return res.status(400).json({
        status: 'success',
        response: null,
        message: 'google',
    });
});

/*
//verify if need middlewares of auth


// app.post('/logout', logoutMD.logoutMiddleware, async (req, res)=>{
app.post('/logout', async(req, res) => {
    return res.status(200).json({
        status: 'success',
        response: null,
        message: 'logout',
    });
    /*

    //=====================================
    // Start delete token..........
    //=====================================
    let jwToken = new jsonWebToken();
    
    let { jti, iat } = req.user;
    await jwToken.deleteTokenByIdjti(jti, iat);
    return res.status(200).json({
        status:'success',
        response:null,
        message:'logout.',
    });
   
})
 */
module.exports = app;