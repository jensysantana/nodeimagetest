'use strict'

const { model, Schema } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

const stores = Schema({
    // products:{ type: Schema.Types.ObjectId, ref:"Products", require:[true, ''], maxlenght:24},
    products: { type: Number, maxlenght: 14 },
    // username:{ type: String,  unique: true, required: true, uniqueCaseInsensitive: true,maxlength:45 },
    store: { type: String, unique: true, required: true, uniqueCaseInsensitive: true, maxlength: 100 },
    url: { type: String, required: [true, ''], maxlength: 64 },
    directory: { type: String, unique: true, required: true, maxlength: 65 },
    logo: { type: String, maxlength: 60 },
    cover: { type: String, maxlength: 60 },
    abstract: { type: String, required: [true, ''], maxlength: 1500 },
    about: { type: String, required: [true, ''], maxlength: 1500 },
    email: { type: String, required: [true, ''], maxlength: 64 },
    address: { type: String, required: [true, ''], maxlength: 64 },
    phone: { type: String, required: [true, ''], maxlength: 25 },
    social: { type: Object },
    auth: { type: Schema.Types.ObjectId, required: [true, ''] },
    status: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: null },
    deletedAt: { type: Date, default: null }
})

stores.plugin(uniqueValidator, { message: 'A store alredy exists with the {PATH}' });

module.exports = {
    Stores: model('Store', stores),
};