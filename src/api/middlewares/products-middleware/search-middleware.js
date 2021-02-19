'use strict'
const app = require('express')();

const SearchGlobal = async (req, res, next)=>{

    try {

        let { search } = req.params;
        // console.log("SearchGlobal -> req.params", req.params)
        // console.log("BestSellerItemsFromCat -> bycategory", bycategory)
        // const newData = JSON.parse(bycategory);
        // console.log("newData-middleware", newData)
        req.searchByPass = JSON.parse(search);
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

module.exports = {
    SearchGlobal: SearchGlobal
}