'use strict';
//=====================================
// Start imports
//=====================================
const app = require('express')();
// const upload = require('../../libs/storage');
const { ProductModel } = require('../../models/products/products');
/*
const getUrlFromRootSubCategory = async(menu_items, subcategory) => {
        // console.log("getUrlFromRootSubCategory -> subcategory", subcategory)
        // console.log("getUrlFromRootSubCategory -> menu_items", menu_items)
        if (menu_items) {
            let tester = menu_items.find(it => it._id === subcategory)
                // console.log("getUrlFromRootSubCategory -> tester", tester)
            return tester;
        }
        return Promise.reject('Product subCategory not match')
    }
   
    app.get('/', [upload('app\\storage\\images').single('image')], async (req, res) =>{

        try {
            const productCounter = await ProductModel.countDocuments();
            const getRandom = Math.floor(Math.random() * productCounter);
            const productStored = await ProductModel.find({})
            .populate({
                path:'category'
            })
            .populate({
                path:'root_subcategory',
            })
            .populate({
                path:'top_banner.img',
            });
            // const productStored222 = await ProductModel.aggregate([
            //     {$match:{rnd: 3 }},
            //     {$sample:{size: 1}}
            // ])

            const productSelected = JSON.parse(JSON.stringify(productStored[getRandom]));
            // const productSelected = JSON.parse(JSON.stringify(productStored[30]));
            productSelected.root_subcategory.menu_items = await getUrlFromRootSubCategory(productSelected.root_subcategory.menu_items, productSelected.subcategory)
            // console.log("respGenerateUrlByProduct", respGenerateUrlByProduct)
            // console.log("productSelected", productSelected.root_subcategory.menu_items)
            // console.log("productSelected", productSelected.subcategory)

            return res.status(200).json({
                status:'success',
                data:JSON.stringify(productSelected),
                message:'',
                // productStored222:productSelected
                // productStored
            });
            
        } catch (error) {
            return res.status(404).json({
                status:'ErrorGetTopBannerProduct',
                data:null,
                message:'Sorry we cannot find your info product.'
            });
        }
    })
    */

module.exports = app;