'use strict'

const { model, Schema } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const htmTemplateType = {
    values: [ 'colors', ],
    message:'${VALUE} we cannot get your html type'
}
const htmTemplatePosition = {
    values: ['1', '2'],
    message:'${VALUE} we cannot get your html type'
}

const Product_size = Schema({
    size:{ type: String, maxlength:20, unique:true },
    // price:{ type:Number, required:[true, ''] },
    // stock:{ type:Number, required:[true, ''] },
    // isDefault:{ type:Number, enum:[1, 2], required:[true, ''] },
    status:{ type:Number, default: 1 },
    createdAt:{type: Date, default: Date.now},
    updatedAt:{type: Date, default: null},
    deletedAt:{type: Date, default: null}
})




// const stores = Schema({
//     html:{ type: String, default:'', enum:htmTemplateType },
//     html_position:{ type: String, default:'', enum:htmTemplatePosition },
//     default_color:{ type: String, maxlength:20 },
//     default_color_code:{ type: String, maxlength:10 },
//     default_size:{ type: String, maxlength:15 },
//     default_img:{ type: String, maxlength:60 },
//     active_sizes:{ type: Schema.Types.ObjectId, ref:"Size", require:[true, ''], maxlenght:24},
//     variants:{ type: Schema.Types.ObjectId, ref:"Size", require:[true, ''], maxlenght:24},
//     auth:{ type: Schema.Types.ObjectId, required:[true, ''] },
//     status:{ type:Number, default: 1 },
//     createdAt:{type: Date, default: Date.now},
//     updatedAt:{type: Date, default: null},
//     deletedAt:{type: Date, default: null}
// })

Product_size.plugin(uniqueValidator, {message:'A store alredy exists with the {PATH}'});

module.exports = {
    Product_size:model('Product_size', Product_size),
};