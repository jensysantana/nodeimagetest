'use strict'
const app = require('express')();

const BestSellerItemsFromCat = async (req, res, next)=>{

    try {

        let { bycategory } = req.params;
        // console.log("BestSellerItemsFromCat -> bycategory", bycategory)
        // const newData = JSON.parse(bycategory);
        // console.log("newData-middleware", newData)
        req.bestSaleItemsByCat = JSON.parse(bycategory);
        next();
    } catch (error) {
        console.log('---------error best seller items from category---------');
        console.log(error);
        console.log('---------error best seller items from category---------');
        return res.status(404).json({
            status:'ErrorInvalidBestSaleItems',
            data:null,
            message:'Sorry we cannot find your info category.'
        });
    }
}

const GetProductById = async (req, res, next)=>{

    try {

        let { productId } = req.params;
        // console.log("BestSellerItemsFromCat -> bycategory", bycategory)
        // const newData = JSON.parse(bycategory);
        // console.log("newData-middleware", newData)
        req.productData = JSON.parse(productId);
       
        next();
    } catch (error) {
        console.log('---------error best product by id middleware---------');
        console.log(error);
        console.log('---------error best product by id middleware---------');
        return res.status(404).json({
            status:'ErrorInvalidItemsDetails',
            data:null,
            message:'Sorry we cannot find your info category.'
        });
    }
}

module.exports = {
    BestSellerItemsFromCat: BestSellerItemsFromCat,
    GetProductById:GetProductById
}