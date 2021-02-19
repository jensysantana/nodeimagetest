'use strict'

const { model, Schema } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

const categories = Schema({
    subcategory: { type: Schema.Types.ObjectId, ref: "SubCategory", required: [false, ''], maxlenght: 24 },
    title: { type: String, index: true, unique: true, required: [true, ''], uniqueCaseInsensitive: true, maxlength: 30 },
    extraClass: { type: String, maxlength: 50, default: null },
    subClass: { type: String, maxlength: 50, default: null },
    image: { type: String, maxlength: 30 },
    description: { type: String, maxlength: 255, required: [false, ''] },
    directory: { type: String, maxlength: 30, required: [true] },
    subMenuContent: [],
    // [
    //     // {
    //     //     heading: { type: String },
    //     //     menuItems: [{ text: { type: String, maxlength:30 },  url: { type: String, maxlength:30 }, }],
    //     // }
    // ],
    url: { type: String, required: [true, ''], maxlength: 30 },
    icon: { type: String, maxlength: 50, required: [true, ''] },

    viewed: { type: Number, maxlength: 12, required: [true, ''], default: 0 },
    auth: { type: Schema.Types.ObjectId, required: [true, ''] },

    status: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: null },
    deletedAt: { type: Date, default: null }
})

// index: true, 

const subCategoriesAndSubMenues = Schema({
    heading: { type: String, required: true, maxlength: 45, unique: true, uniqueCaseInsensitive: true, },
    url: { type: String, required: [true, ''], maxlength: 30 },
    directory: { type: String, maxlength: 30, required: [true] },
    extra_class: { type: String, maxlength: 50, default: null },
    sub_class: { type: String, maxlength: 50, default: null },
    menu_items: [{
        text: { type: String, maxlength: 30, required: [true], unique: true, uniqueCaseInsensitive: true },
        url: { type: String, maxlength: 30, required: [true] },
        directory: { type: String, maxlength: 30, required: [true] },
        image: { type: String, maxlength: 30, default: null },
        inventory: { type: Number },
        viewed: { type: Number, maxlength: 14, default: 0 },
        extraClass: { type: String, maxlength: 50, default: null },
        subClass: { type: String, maxlength: 50, default: null },
    }],
    auth: { type: Schema.Types.ObjectId, ref: 'Auth', required: [true, ''] },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: [true, ''] },
    status: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: null },
    deletedAt: { type: Date, default: null }
})

categories.plugin(uniqueValidator, { message: 'A category alredy exists with the {PATH}' });
subCategoriesAndSubMenues.plugin(uniqueValidator, { message: 'A Subcategory alredy exists with the {PATH}' });
module.exports = {
    Categories: model('Category', categories),
    SubCategories: model('Subcategory', subCategoriesAndSubMenues),
};