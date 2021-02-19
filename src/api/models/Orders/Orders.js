'use strict'
const { model, Schema } = require('mongoose')
const order = Schema({
    // products:{ type: Schema.Types.ObjectId, ref:"Products", require:[true, ''], maxlenght:24},
    transmitter:{ 
        type: String, 
        // index: true, 
        // unique: true, 
        required: true, 
        // uniqueCaseInsensitive: true,
        maxlength:150
    },
    receiver:{ 
        type: String, 
        // index: true, 
        // unique: true, 
        required: true, 
        // uniqueCaseInsensitive: true,
        maxlength:150
    },
    // message: { 
    //     type:String, 
    //     required:[true, ''],
    //     maxlength:300
    // },
    answer: { 
        type:String, 
        required:[true, ''],
        maxlength:300
    },
    // dispute: { type: Schema.Types.ObjectId, ref:"Dispute", require:[true, ''], maxlenght:24},
    dispute:{ 
        type: String,
        maxlength:30
    },
    stage:{ 
        type: String, 
        // index: true, 
        // unique: true, 
        // uniqueCaseInsensitive: true,
        maxlength:30
    },
    auth:{ 
        type: Schema.Types.ObjectId, 
        required:[true, ''] 
    },
    status:{ type:Number, default: 1 },
    createdAt:{type: Date, default: Date.now},
    updatedAt:{type: Date, default: null},
    deletedAt:{type: Date, default: null}
})

module.exports = {
    Orders:model('Order', order),
};