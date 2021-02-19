'use strict'
const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let tokensModel = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: "Auth" },
    // token_id:{ type:String, required:[true, 'Invalid token'] },
    device_type: { required: true, type: String },
    iat: { type: String, required: [true, ''] },
    exp: { type: String, required: [true, ''] },
    token_type: { type: String, required: [true, ''] },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('tokens', tokensModel);