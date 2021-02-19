'use strict';
//=====================================
// Start imports
//=====================================
/*
const app = require('express')();
const { ProductModel } = require('../../models/products/products');
const GlobalHelpers = require('../../helpers/global-helpers');

app.get('/:has_horizontal_slider/:qtyRequest', async (req, res) =>{

    try {
        const {
            has_horizontal_slider,
            qtyRequest
        } = req.params;
        const hasHorizontalSlider = has_horizontal_slider === 'true' ? true : false;
        let qty = parseInt(qtyRequest);
        if (!hasHorizontalSlider || !qty) {
            return res.status(404).json({
                status:'ErrorHomeSlider',
                data:null,
                message:'Sorry, we cannot get the sliders products.'
            });
        }
        
        if (qty === 10) {
            qty = 10;
        }
        if (qty === 2) {
            qty = 2;
        }
        
        // console.log("has_horizontal_slider")
        // console.log(hasHorizontalSlider);
        // console.log(hasHorizontalSlider);
        // console.log("has_horizontal_slider")
        const counterDocuments = await ProductModel.find({has_horizontal_slider:true}).countDocuments();
        
        // console.log('---------counterDocuments---------');
        // console.log(counterDocuments);
        // console.log('---------counterDocuments---------');
        const productCounter = await ProductModel.countDocuments();
        // console.log("productCounter", productCounter)
        const getRandom = Math.floor(Math.random() * productCounter);
        let skiper = getRandom;
        // console.log("getRandom", getRandom)
        // console.log('---------Math.random()---------');
        // console.log((Math.random()+.18));
        // console.log(skiper);
        if (skiper === counterDocuments || skiper+1 === counterDocuments) {
            skiper = skiper - qty;
        }
        if (skiper < 0) {
            skiper = 0;
        }
        // const product = await ProductModel.find({has_horizontal_slider:true}, null, {skip:skiper, limit:qty}).populate('category');
        // , 'root_subcategory category has_horizontal_slider horizontal_slider subcategory'
        const product = await ProductModel.find({has_horizontal_slider:true}, null, {skip:skiper, limit:qty}).populate({
            path:'category',
            select:'directory title url'
        })
        .populate({
            path:"root_subcategory",
            select:'directory heading menu_items url',
            // match:{menu_items: dsds}
        })
        .populate({path: 'default_banner'})
        .populate({path: 'vertical_banner'})

        const productSelected = JSON.parse(JSON.stringify(product));
        // console.log("productSelected", productSelected)
        // const productSelected = JSON.parse(JSON.stringify(productStored[30]));
        const GHelpers = new GlobalHelpers();

        // for (const iterator of productSelected) {
        //     iterator.root_subcategory.menu_items
        //     iterator.root_subcategory.menu_items = await GHelpers.getUrlFromRootSubCategory(iterator.root_subcategory.menu_items, iterator.subcategory)
        // }
        await GHelpers.getArrayUrlFromRootSubCategory(productSelected);
        // productSelected.root_subcategory.menu_items = await GHelpers.getUrlFromRootSubCategory(productSelected.root_subcategory.menu_items, productSelected.subcategory)
        // let sliderProds = JSON.stringify(productSelected)
        // if (req.file) {
        //     const { filename } = req.file;;
        //     product.setImageUrl(filename)
        // }
        // const productStored = await product.save();
        return res.status(200).json({
            status:'success',
            data:JSON.stringify(productSelected),
            message:null,
            skiper:skiper,
        });
        
    } catch (error) {
        console.log("error", error)
        return res.status(404).json({
            status:'ErrorHomeSlider',
            data:null,
            message:'Sorry, we cannot get the sliders products.'
        });
    }

})
*/
module.exports = app;