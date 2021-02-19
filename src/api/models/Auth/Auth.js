'use strict';
const { model, Schema } = require('mongoose');
// let Schema = mongoose.Schema;

let uniqueValidator = require('mongoose-unique-validator');

let authSchema = new Schema({
    fname: {
        type: String,
        required: [true, 'Enter first name'],
        maxlength: [45, '{PATH} must be between 1 to 45 characters.'],
    },
    lname: {
        type: String,
        required: [true, 'Enter last name'],
        maxlength: [45, '{PATH} must be between 1 to 45 characters.'],
    },
    password: {
        type: String,
        required: [true, 'Enter a password'],
        minlength: [8, '{PATH} must be between 8 to 32 characters.'],
        maxlength: [255, '{PATH} must be between 8 to 32 characters.']
    },
    email: {
        type: String,
        unique: true,
        uniqueCaseInsensitive: true,
        required: [true, 'Enter your email address'],
        maxlength: [64, '{PATH} must be between 7 to 64 characters.']
    },
    emailVerifyAt: {
        type: Date,
        default: null
    },
    emailCreateVerifyTokenAt: {
        type: Date,
        default: null
    },
    emailTotalVerifyTokenSentToday: {
        type: Number,
        default: 0
    },
    authorization_code: {
        type: String,
        reguired: [true]
    },
    phone: {
        type: String,
        required: [false, 'Enter a mobile phone number'],
        maxlength: 15,
        minlength: 10,
        default: null
    },
    phoneVerifyAt: {
        type: Date,
        default: null
    },
    phoneVerifyCode: {
        type: String,
        default: null
    },
    phoneCreatedVerifyCodeAt: {
        type: Date,
        default: null
    },
    phoneTotalSmsVerifySent: {
        type: Number,
        default: 0
    },
    // username:{type:String, unique:true, required:[true, 'Enter your user name address'], minlength: [7, '{PATH} must be between 7 to 64 characters.'], maxlength: [64, '{PATH} must be between 7 to 64 characters.']},
    // total_store_user_has: {
    //     type: Number,
    //     default: null,
    //     maxlength: 3
    // },
    // total_active_store_user_has: {
    //     type: Number,
    //     default: null,
    //     maxlength: 3
    // },
    // total_store_user_has_unpaid: {
    //     type: Number,
    //     default: null,
    //     maxlength: 3
    // },
    images: {
        type: Schema.Types.ObjectId,
        ref: "UserImage",
        required: false,
        maxlength: 24
    },
    // device: {
    //     type: String,
    //     maxlength: 30
    // },
    address: {
        type: String,
        maxlength: 200
    },
    // quantityDeviceCanConnect:{type:Number, default:2},
    is_vendor: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        default: 'I'
    },
    // isValidAccount:{type:String, default:'N'},
    terms: {
        type: Boolean,
        default: true
    },
    userFrom: {
        type: String,
        default: 'LOCAL',
        enum: ['LOCAL', 'GOOGLE', 'FACEBOOK'],
        required: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: null },
    deletedAt: { type: Date, default: null }
});
authSchema.plugin(uniqueValidator, { message: 'An account already exists with the {PATH}' });

const passwordRecoveryBackup = Schema({
    user_id: { type: Schema.Types.ObjectId, required: true, ref: 'Auth' },
    password: {
        type: String,
        maxlength: [255, '{PATH} must be between 8 to 32 characters.'],
    },
    createdAt: { type: Date, default: Date.now }
});



module.exports = {
    AuthModel: model('Auth', authSchema),
    PasswordRecoveryBackup: model('passwordRecoveryBackup', passwordRecoveryBackup)
};