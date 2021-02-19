'use strict';
//=====================================
// Start imports
//=====================================
/*
const app = require('express')();
const { ProductModel } = require('../../models/products/products');
const { ProductReviews } = require('../../models/reviews/reviews');

app.post('/', async(req, res)=>{
    
    try {
        const { comment, review, auth, product } = JSON.parse(req.body.review_info);
        const obj = await ProductReviews.create({
            product,
            comment,
            review,
            auth,
        })
    
        return res.status(200).json({
            status: 'success',
            data:obj,
            // data: JSON.stringify(),
            message: ''
        });
        
    } catch (error) {
        return res.status(404).json({
            status: 'ErrorCreateReviews',
            data:null,
            message: ''
        });
    }

})

app.get('/:review_info', async(req, res)=>{
    
    try {
        const { _id } = JSON.parse(req.params.review_info);
        
        const obj = await ProductReviews.find({
            product:_id
        }, 'auth comment createdAt review');
        
        return res.status(200).json({
            status: 'success',
            // data:obj,
            data: JSON.stringify(obj),
            message: ''
        });
        
    } catch (error) {
        return res.status(404).json({
            status: 'ErrorShowReviews',
            data:null,
            message: ''
        });
    }
})
*/

module.exports = app;