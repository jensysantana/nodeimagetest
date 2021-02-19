'use strict';
const jwt = require('jsonwebtoken');
const gHelpers = require('../helpers/global-helpers');
const tokensModel = require('../models/token-model/token-model');
const { AuthModel } = require('../models/Auth/Auth');
const { TOKEN: { TOKENSEED, ACCESS_TOKEN_SECRET_KEY } } = require('../../config/config');

class JsonWebToken {
    async GetParseJwtPayload(token) {
        // no used but good function
        try {
            if (await this.VerifyToken(token)) {
                token = JSON.parse(Buffer.from(token.split('.')[1], 'base64'));
                let { iat, exp, jti } = token;
                return { iat, exp, jti };
            }
            return false;
        } catch (error) {
            return false;
        }
    }
    async registerUser(data) { //XXXX
        let tkModel = new tokensModel({
            ...data,
            createdAt: new Date()
        });
        await tkModel.save();
        return true;
        // await tokensModel.findByIdAndDelete({ _id: _idX });
    }

    async tokenSignIn(exp, user, access_token_secret_key, device) {
        let tkModel = new tokensModel({
            user_id: user._id,
            device_type: device,
            token_type: 'login',
        });
        const newToken = await jwt.sign({ user }, access_token_secret_key, { expiresIn: exp, jwtid: `${tkModel._id}` });
        const expiration = await this.GetParseJwtPayload(newToken);
        tkModel.exp = expiration.exp; //token expiration
        tkModel.iat = expiration.iat; //emited date token
        tkModel.save();
        return newToken;
    }

    async tokenSignUp(exp, user, access_token_secret_key, device) {
        let tkModel = new tokensModel({
            user_id: user._id,
            device_type: device,
            token_type: 'register',
        });
        const newToken = await jwt.sign({ user }, access_token_secret_key, { expiresIn: exp, jwtid: `${tkModel._id}` });
        const expiration = await this.GetParseJwtPayload(newToken);
        tkModel.exp = expiration.exp; //token expiration
        tkModel.iat = expiration.iat; //emited date token
        tkModel.save();
        return newToken;
    }

    async tokenRecoveryAccount(exp, user, access_token_secret_key, device) {
        let tkModel = new tokensModel({
            user_id: user._id,
            device_type: device,
            token_type: 'recoveryAccount',
        });
        const newToken = await jwt.sign({ user }, access_token_secret_key, { expiresIn: exp, jwtid: `${tkModel._id}` });
        const expiration = await this.GetParseJwtPayload(newToken);
        tkModel.exp = expiration.exp; //token expiration
        tkModel.iat = expiration.iat; //emited date token
        tkModel.save();
        return newToken;
    }

    async tokenRefresher(exp, user, access_token_secret_key, device) {
        let tkModel = new tokensModel({
            user_id: user._id,
            device_type: device,
            token_type: 'register',
        });
        console.log('---------tkModel---------');
        console.log(tkModel);
        console.log('---------tkModel---------');
        const newToken = await jwt.sign({ user }, access_token_secret_key, { expiresIn: exp, jwtid: `${tkModel._id}` });
        const expiration = await this.GetParseJwtPayload(newToken);
        tkModel.exp = expiration.exp; //token expiration
        tkModel.iat = expiration.iat; //emited date token
        tkModel.save();
        return newToken;
    }

    async Token(exp, user, access_token_secret_key, device, typeToken) {
        let tokenjti = null;
        if (user.jti) {
            tokenjti = user.jti;
            // tokenjti = JSON.parse(JSON.stringify(user.jti));
            delete user.jti;
            delete user.iat;
            delete user.exp;
        }

        //generate a unique id for token: 
        let gbHelpers = new gHelpers();
        let random = await gbHelpers.GenerateStringRandom(8, 'hex');
        let userId = JSON.parse(JSON.stringify(user._id));
        userId = userId.substr(8, 24);
        random = `${userId}${random}`;
        // const newRandom = random.split('').sort().join('');

        let newToken = await jwt.sign({ user }, access_token_secret_key, { expiresIn: exp, jwtid: random });
        const expiration = await this.GetParseJwtPayload(newToken)

        //=====================================
        // user id
        // token jwtid,
        // then count autoriced token user has
        //=====================================

        // let tkModel = new tokensModel();
        const dataToSave = {
            user_id: user._id,
            token_id: random,
            device_type: device,
            exp: expiration.exp,
            iat: expiration.iat,
            token_type: typeToken,
        }

        if (typeToken === 'register') {
            const tkMd = await this.registerUser(dataToSave)
            if (tkMd) {
                return newToken;
            }
        }

        if (typeToken === 'login') {
            const tkMd = await this.registerUser(dataToSave)
            if (tkMd) {
                return newToken;
            }
        }
        if (typeToken === 'recoveryAccount') {
            const tkMd = await this.registerUser(dataToSave)
            if (tkMd) {
                return newToken;
            }
        }

        if (typeToken === 'refresh') {
            try {

                let tokenDB = await tokensModel.findOne({ token_id: tokenjti })
                await tokensModel.findByIdAndUpdate({ _id: tokenDB._id }, { $set: { token_id: random, iat: expiration.iat, exp: expiration.exp, device_type: device, createdAt: new Date(), token_type: 'refresh' } });
                return newToken;
            } catch (error) {
                return false;
            }

        }
    }

    async compareToken(token, typeToken) {
        // token.tokenTOKENSEED
    }

    async VerifyToken(token) {
        //used
        try {
            const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET_KEY);
            return { tokenStatus: 'Valid token', decoded: decoded, error: null };
        } catch (error) {
            if (error.hasOwnProperty('expiredAt')) {
                return { tokenStatus: 'Token expire', decoded: {}, error };
            }
            return { tokenStatus: 'Invalid token', decoded: {}, error };
        }
    }

    async GetUserDataFromToken(token) {
        let rToken = jwt.decode(token, ACCESS_TOKEN_SECRET_KEY);
        if (rToken) {
            //UPDATE ACCOUNT STATUS VERIFY
            return rToken;
        }
        return null;
    }



    async deleteTokenById(query) {
        const rp = await tokensModel.findOneAndDelete(query);
        if (!rp) {
            return false;
        }
        return true;
    }
    async deleteAllToken(query) {
        const rp = await tokensModel.deleteMany(query);
        if (!rp) {
            return false;
        }
        return true;
    }

    BackDate(user) { //xxxxxxx
        var older_token = jwt.sign({ user: user, iat: Math.floor(Date.now() / 1000) - 30 }, 'shhhhh');
    }

    async deleteTokenByIdjti(token_id, iat) { //xxx

        await tokensModel.findOneAndDelete({ token_id, iat });
        // console.log(1111111111111);
        // console.log(11111111111111111);
        return true;
    }

    async tokenValidToRefresh(iat, dataTime) {

        try {

            // {limitValidTime: 2, typeTime:'minutes'}
            let { iat } = user;
            let emitDate = new Date();
            emitDate.setTime(iat * 1000);
            emitDate.getMinutes()

            let gbHelpers = new gHelpers();
            let vDate = gbHelpers.DiffDate(new Date(), emitDate, dataTime.typeTime);
            // console.log('generate tokeeeeeeeeeeeeeeeeeeeeeeeeeeee');
            // console.log(vDate);
            return vDate;
            // console.log('generate tokeeeeeeeeeeeeeeeeeeeeeeeeeeee');
            //if ((exp > Date.now() / 1000) && vDate >= 1) {
            // if (vDate > dataTime.limitValidTime) {
            //     // console.log('more then one minutes');
            //     // console.log(vDate);
            //     // console.log(dataTime.limitValidTime);
            //     // console.log(emitDate);

            //     // console.log('more then one minutes');
            //     return true;


            // //    return await this.Token('7d', user, device, 'refresh');
            // }
            // console.log('NO GENERATE TOLKKEEEEEEEEEEEEE');
            // return false;
        } catch (error) {
            return true;
        }

    }

    async tokenValidateFrontAndDB(user, device, dataTime) {
        const { _id, iat, exp, jti } = user;
        try {

            let tokensMD = await tokensModel.find({ user_id: user._id });
            if (tokensMD.length === 0) {
                //=============================
                // If user not have token in db
                //=============================
                return {
                    status: false,
                    message: 'The token is invalid.'
                };
            }

            if (tokensMD.length > 2) {
                //===================================================
                // Start more then 2 token must be delete all of them
                //===================================================
                await tokensModel.deleteMany({ user_id: user._id });
                return {
                    status: false,
                    message: 'Required logout.'
                };
            }

            //==================================================================================
            // Start if have token use iterator for to find local db token id by device type // && iterator.token_id === jti && iterator.user_id === _iditerator.user_id === _id
            //==================================================================================
            for (const iterator of tokensMD) {
                // if (iterator.device_type !== undefined && iterator.device_type === device && iterator.user_id == _id && iterator.token_id === jti) {
                // console.log('---------iterator---------');
                // console.log(iterator);
                // console.log('---------iterator---------');

                if (iterator.token_type === 'register') {
                    return {
                        status: false,
                        message: 'Required logout.',
                    }
                }

                if (iterator.user_id == _id && iterator.token_id === jti) {
                    // return {

                    //     message: 'The token is invalid. ******************************'
                    // };
                    let newDataUnix = Math.floor(Date.now() / 1000);
                    if (parseInt(iterator.iat) > newDataUnix) {
                        //==============================
                        // Start if emit date > now
                        //==============================
                        return {
                            status: false,
                            message: 'The token is invalid.',
                        }
                    }
                    if (newDataUnix > parseInt(iterator.exp)) {
                        //==============================
                        // Start if now is > expiration date
                        //==============================
                        console.log('iterator');
                        console.log(newDataUnix);
                        console.log(iterator.exp);
                        console.log('iterator');

                        return {
                            status: false,
                            message: 'The token is invalid.',
                        }
                    }

                    let dateInfo = await this.tokenValidToRefresh(iat, dataTime);
                    if (parseInt(iterator.exp) > newDataUnix && dataTime.limitValidTime > dateInfo) {
                        return {
                            status: true,
                            message: 'The token is success',
                        }
                    }
                    if (dateInfo > dataTime.limitValidTime && parseInt(iterator.exp) > newDataUnix) {
                        return {
                            status: false,
                            message: 'The token is expired.',
                            dateInfo,
                            dt: dataTime.limitValidTime,
                            newDataUnix
                        }
                    }
                }
            }
            // console.log('tokenValidateFrontAndDB');
            // console.log(user);
            // console.log(device);
            // console.log('tokenValidateFrontAndDB');
            return {
                status: false,
                message: 'The token is invalid.'
            };
        } catch (error) {
            return false;
        }
    }

    async validateTokenFromDataBase(query) {
        const tokensMD = await tokensModel.findOne(query);
        if (!tokensMD) {
            //=============================
            // If user not have token in db
            //=============================
            return {
                status: false,
                message: 'Token does not exists.',
                data: null
            };
        }
        return {
            status: true,
            data: tokensMD
        };
    }

    async helperTokenValidateFrontAndDB(user, device) { //xxxxxxxxxxxxxxx

        try {

            let tokensMD = await tokensModel.find({ user_id: user._id });

            // console.log('helperTokenValidateFrontAndDB');
            // console.log(tokensMD);
            // console.log('helperTokenValidateFrontAndDB');

            if (tokensMD.length === 0) {
                //=========================================================
                // Start save token id - firts time user sign in to the app
                //=========================================================
                await tkModel.save();
                return newToken;
            }

            // if (tokensMD.length > 2) {
            //     //===================================================
            //     // Start more then 2 token must be delete all of them
            //     //===================================================
            //     await tokensModel.deleteMany({ user_id:user._id });
            // }
            // let idToUpdate = null;
            // for (const iterator of tokensMD) {

            //     if (iterator.device_type !== undefined) {
            //         if (iterator.device_type === device) {
            //             idToUpdate = iterator._id;
            //         }
            //     }

            // }

            // if (!idToUpdate && tokensMD.length > 1) {
            //     //=====================================================================
            //     // BEFOR REGISTER NEW DEVICE DELETE OLD DEVICE NUMBER 2 AND ADD NEW ONE
            //     //=====================================================================
            //     // await tokensModel.findByIdAndDelete({_id:tokensMD[1]._id});
            //     // await tkModel.save();
            //     await tokensModel.findByIdAndUpdate({_id:tokensMD[1]._id}, {$set:{ token_id: random, device_type:device, createdAt:new Date() }});
            //     return newToken;
            // }

            // if (idToUpdate) {
            //     //=====================================
            //     // HAVE ID DEVICE ALREADY IN DB
            //     //=====================================
            //     await tokensModel.findByIdAndUpdate({_id:idToUpdate}, {$set:{ token_id: random, device_type:device, createdAt:new Date() }});
            //     return newToken;
            // }


        } catch (error) {
            // console.log('ERROROSSSS.............');
            // console.log(error);

            // console.log('ERROROSSSS.............');
            return false;
        }
    }

    async VerifyIfTokenNeedToRefresh(token, user, device) { //xxxxxxxxxxxxxxxxxxx

        try {
            let payload = await this.GetParseJwtPayload(token);
            // console.log('payload');
            // console.log(payload);
            // console.log('payload');

            if (payload && typeof payload === 'object') {
                let { iat, exp, jti } = payload;
                let emitDate = new Date();
                emitDate.setTime(iat * 1000);
                emitDate.getMinutes()

                let gbHelpers = new gHelpers();
                let vDate = gbHelpers.DiffDate(new Date(), emitDate, 'minute');

                // console.log('generate tokeeeeeeeeeeeeeeeeeeeeeeeeeeee');
                // console.log(vDate);

                // console.log('generate tokeeeeeeeeeeeeeeeeeeeeeeeeeeee');
                //if ((exp > Date.now() / 1000) && vDate >= 1) {
                if (vDate >= 1) {
                    //    return await this.Token('7d', user, device, 'refresh');
                }
                // console.log('NO GENERATE TOLKKEEEEEEEEEEEEE');
                return true;
            }
        } catch (error) {
            return true;
        }
    }
}

module.exports = JsonWebToken;

/*
 * Remove extraneous token metadata to get the token payload
 * Note: this list may grow over time: https://www.iana.org/assignments/jwt/jwt.xhtml
 * @param {string|Object} token a JSON Web Token (JWT)
 */
// function cleanJWT(token) {
//     if (typeof token === 'string') {
//       return token;
//     }
//     const cleanToken = { ...token };
//     delete cleanToken.iss;
//     delete cleanToken.sub;
//     delete cleanToken.aud;
//     delete cleanToken.exp;
//     delete cleanToken.nbf;
//     delete cleanToken.iat;
//     delete cleanToken.jti;
//     return cleanToken;
//   }
//   cleanJWT(jwt.verify(...))