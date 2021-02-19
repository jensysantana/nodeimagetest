'use strict'
const { model, Schema } = require('mongoose');

const product_reviews = Schema({
    comment:{ type:String, require:[true, ''], maxlength: 2000 },
    review:{ type:Number, require:[true, ''] },
    product:{ type: Schema.Types.ObjectId, ref:'Product', required:[true, ''] },
    auth:{ type: Schema.Types.ObjectId, ref:'Auth', required:[true, ''] },
    status:{ type:Number, default: 1 },
    createdAt:{type: Date, default: Date.now},
    updatedAt:{type: Date, default: null},
    deletedAt:{type: Date, default: null}
})

module.exports = {
    ProductReviews: model('Product_review', product_reviews)
}