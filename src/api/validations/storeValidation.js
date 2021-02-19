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
//             console.log('====================================');
//             console.log(error);
//             console.log('====================================');
//             next(new ValidationError(error));
//         }
//     };
    
// }

function StoreValidation(select){
    return async (data)=>{
        let gbHelpers = new gHelpers();
        let email = yup.string().matches(gbHelpers.GRegExp().email, 'Email is invalid or doesn\'t exist').min(7).max(64).required('enter an email').trim(), 
        name = yup.string().matches(gbHelpers.GRegExp().alphaNumSpace, 'Name can be only letters and numbers').min(1).max(100).required().trim(),
        catchword = yup.string().matches(gbHelpers.GRegExp().alphaNumSpace, {message:'Catch word can be only letters and numbers', excludeEmptyString:true}).max(70).trim(),
        phone = yup.string().matches(gbHelpers.GRegExp().number, 'Phone must match the following: 5029990000').min(9).max(15).required('enter a mobile phone number').trim(),
        fax = yup.string().max(15).matches(/^[0-9]+$/, {message:'Fax must match the following: 5029990000', excludeEmptyString: true }).trim(),
        mcn = yup.string().matches(gbHelpers.GRegExp().number, 'MC number must be only numbers').min(6, 'MC# must be between 6 to 8 characters').max(8, 'MC# must be between 6 to 8 characters').required('Enter your MC# number').trim(),
        dotn = yup.string().matches(gbHelpers.GRegExp().number, 'DOT number must be only numbers').min(6, 'DOT# must be between 7 to 8 characters').max(8, 'DOT# must be between 7 to 8 characters').required('Enter your DOT# number').trim(),
        website = yup.string().url('Ej valid web site: https://www.mywebpage.com').trim(),
        plan = yup.string().matches(gbHelpers.GRegExp().isMongoId, 'Select a valid plan').required('Select a city').trim();
        
        let newObj = {};

        if (select === 'create') {
            newObj ={
                email:email,
                name: name,
                catchword: catchword,
                phone: phone,
                fax: fax,
                mcn,
                dotn,
                website: website,
                plan
            };
        }
        // console.log('---------data---------');
        // console.log(data);
        // console.log('---------data---------');

        const schema = yup.object().shape(newObj);
        await schema.validate(data, { abortEarly: false });
    }
}

module.exports = {
    // Validate,
    StoreValidation
}