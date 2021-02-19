'use strict'
const { model, Schema } = require('mongoose')
const objSchema = Schema({
    order:{ type: Schema.Types.ObjectId, ref:"Order", require:[true, ''], maxlenght:24},
    auth:{ type: Schema.Types.ObjectId, ref:"Auth", require:[true, ''], maxlenght:24},
    payment:{ type: Schema.Types.ObjectId, ref:"Auth", require:[true, ''], maxlenght:24},
    payment_method:{ type: Schema.Types.ObjectId, ref:"Payment_method", require:[true, ''], maxlenght:24},
    // sale_detail:{ type: Schema.Types.ObjectId, ref:"Sale_detail", require:[true, ''], maxlenght:24},
    product:{ type: Schema.Types.ObjectId, ref:"Product", require:[true, ''], maxlenght:24},
    platform_fees: {  type: Number,  required: [true],  maxlength:14 },
    qty:{  type: Number,  required: true,  maxlength:14 },
    total:{  type: Number,  required: true,  maxlength:14 },
    unit_price:{  type: Number,  required: true,  maxlength:14 },
    status:{ type:Number, default: 1 },
    createdAt:{type: Date, default: Date.now},
    updatedAt:{type: Date, default: null},
    deletedAt:{type: Date, default: null}
})

module.exports = {
    Sales:model('Sale', objSchema),
};