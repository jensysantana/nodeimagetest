'use strict';
let gHelpers = require('../helpers/global-helpers');
const yup = require('yup');
// const ValidationError = require('../errors/ValidationError');

// function Validate(callback){

//     return async (req, res, next)=>{
        
//         try {
//             let gbHelpers = new gHelpers();
//             let data = req.body;
//             if (!gbHelpers.CheckObjectIsEmpty(req.params)) {
//                 data = req.params;
//             }
//             await callback(data);
//             next();

//         } catch (error) {
//             // next(error);
//             // console.log('====================================');
//             // console.log(error);
//             // console.log('====================================');
//             next(new ValidationError(error));
//         }
//     };
// }

function UserAccessValidation(select){
    return async (data)=>{
        const gbHelpers = new gHelpers(), 
        name = yup.string().matches(gbHelpers.GRegExp().alphaNumSpace, 'Name can be only letters and numbers').min(1).max(100).required(),
        nameNoRequired = yup.string().matches(gbHelpers.GRegExp().alphaNumSpace, 'Description can be only letters and numbers').max(200);
        let newObj = {};
        
        if (select === 'create') {
            newObj ={
                name: name,
            };
            if (data.desc) {
                newObj.desc = nameNoRequired
            }
        }
        const schema = yup.object().shape(newObj);
        await schema.validate(data, { abortEarly: false });
    }
}

module.exports = {
    // Validate,
    UserAccessValidation
}