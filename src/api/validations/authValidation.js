'use strict';
let gHelpers = require('../helpers/global-helpers');
const yup = require('yup');

async function AuthValidation(data, select) {
    let gbHelpers = new gHelpers();
    let email = yup.string().trim().max(64, 'Email is too long').matches(gbHelpers.GRegExp().email, 'Email is invalid or doesn\'t exist').required('Enter an email'),
        password = yup.string().min(8).max(32, 'Password is too long').matches(gbHelpers.GRegExp().password, 'Enter a valid password').required('Enter a password'),
        fname = yup.string().trim().min(2).max(45, 'First name is too long').matches(gbHelpers.GRegExp().alphaSpace, 'Enter a valid name').required('Enter first name'),
        lname = yup.string().trim().min(2).max(45, 'Last name is too long').matches(gbHelpers.GRegExp().alphaSpace, 'Enter a valid last name').required(),
        cpassword = yup.string().test("password-match", 'Confirm password doesn\'t match', function(value) {
            // console.log("AuthValidation -> value", value);
            // console.log('---------this.parent.password---------');
            // console.log(this.parent.password);
            // console.log('---------this.parent.password---------');
            return this.parent.password === value;
        }).min(8).max(32, 'Confirm password is too long').matches(gbHelpers.GRegExp().password, 'Enter a valid password').required('confirm password doesn\'t match'),
        phone = yup.string().min(10).max(15).matches(gbHelpers.GRegExp().number, 'phone must match the following: 5029990000').required('Enter a mobile phone number'),
        phoneCode = yup.string().min(6).max(6).matches(gbHelpers.GRegExp().number, 'phone code must be numbers').required('Enter Phone recovery code')
        // countryCode = yup.string().min(1).max(45).matches(/^[a-z-A-Z]{2}+$/, 'Country phone is not valid').required()
    ;

    //terms = yup.bool().oneOf([true], 'Field must be checked').required('Field must be checked');

    let newObj = {};

    if (select === 'login') {
        newObj = {
            email: email,
            password: password
        };
    }

    if (select === 'forgotpw') {
        // let emailOrPhone = null;
        // if (data.email.search('@') === -1) {
        //     console.log('---------phone---------');
        //     console.log('phone');
        //     console.log('---------phone---------');
        // } 
        // else {
        //     emailOrPhone = yup.string().trim().min(7).max(64).matches(gbHelpers.GRegExp().emailOrPhone, 'Invalid email address.').required('Enter your email address.');
        //     console.log('---------email---------');
        //     console.log(data.email);
        //     console.log('---------email---------');
        // }
        newObj = {
            email: email,
        };
    }

    if (select === 'emailAndPasswordOnly') {
        newObj = {
            email: email,
            password: password
        };
    }

    if (select === 'emailPhonePhoneCodePass') {
        newObj = {
            password: password,
            email: email,
            phone: phone,
            phoneCode: phoneCode
        };
    }

    if (select === 'resetPass') { //not used
        newObj = {
            password: password,
            cpassword: cpassword,
        };
    }
    // console.log('====================================');
    // console.log(data);
    // console.log('====================================');
    if (select === 'signUp') {
        newObj = {
            fname: fname,
            lname: lname,
            email: email,
            password: password,
            cpassword: cpassword
        };
    }
    const schema = yup.object().shape(newObj);
    await schema.validate(data, { abortEarly: false })
}

module.exports = {
    AuthValidation
}