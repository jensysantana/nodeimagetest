'use strict'

const { model, Schema } = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');

const Product_image = Schema({
    product:{ type: Schema.Types.ObjectId },
    name: { type:String },
    alternativeText: { type: String, default:null },
    caption: { type: String, default:null  },
    width: { type: Number },
    height: { type: Number },
    formats: { type: String },
    hash: { type: String, maxlength:35 },
    ext: { type: String, maxlength:8 },
    mime: { type: String, maxlength:15 },
    size:{ type: Number },
    url:{ type: String, maxlength:80, default:null },
    previewUrl: { type: String, maxlength:80, default:null  },
    provider: { type: String, maxlength:45, default:'local'  },
    provider_metadata: { type: String, maxlength:100, default:null },
    image_type: { type: String, maxlength:20, required:[true, '']  },
    status: {type: Number, default: 1},
    is_active: { type:Boolean, default:false },
    activatedAt:{type: Date, default: null},
    createdAt:{type: Date, default: Date.now},
    updatedAt:{type: Date, default: null},
    deletedAt:{type: Date, default: null},
})

// Product_image.plugin(uniqueValidator, {message:'A store alredy exists with the {PATH}'});

module.exports = {
    Product_image:model('Product_image', Product_image),
};