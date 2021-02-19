'use strict';
//=====================================
// Start imports
//=====================================
const app = require('express')();
const moment = require('moment');
// const upload = require('../../libs/storage');
const { ProductModel } = require('../../models/products/products');
const { Categories } = require('../../models/categories/categories');


// const { BestSellerItemsFromCat, GetProductById } = require('../../middlewares/products-middleware/products-middleware');
const GlobalHelpers = require('../../helpers/global-helpers');
/*
app.post('/', [upload('app\\storage\\images').single('image')], async(req, res) => {

    try {
        const {
            title,
            is_featured,
            // is_hot,
            price,
            // sale_price,
            vendor,
            reviews,
            depot,
            inventory,
            // is_out_of_stock,
            // is_active,
            // is_sale,
            name,
            tags,
            url,
            shipping,
            delivery_date,
            offer,
            specification,
            details,
            description,
            images,
            thumbnail,
            brands,
            top_banner,
            collections
        } = req.body;

        const product = new ProductModel({
            title,
            is_featured,
            // is_hot,
            price,
            // sale_price,
            vendor,
            reviews,
            depot,
            inventory,
            // is_out_of_stock,
            // is_active,
            // is_sale,
            name,
            tags,
            url,
            shipping,
            delivery_date,
            offer,
            specification,
            details,
            description,
            images: JSON.stringify(images),
            thumbnail,
            brands: JSON.parse(brands),
            top_banner: JSON.parse(top_banner),
            collections: JSON.parse(collections),
            rnd: await ProductModel.countDocuments() + 1
        })

        // if (req.file) {
        //     const { filename } = req.file;
        //     product.setImageUrl(filename)
        // }

        const productStored = await product.save();
        res.status(200).json({
            status: 'success',
            // productStored:productStored,
            top_banner
        });

    } catch (error) {
        res.status(404).json({
            status: 'ErrorCreatingProduct',
            error
        });
    }

});
*/

app.get('/', async(req, res) => {

    try {
        // console.log('---------productCounter-111111--------');
        const productCounter = await ProductModel.countDocuments();
        const getRandom = Math.floor(Math.random() * productCounter);
        const productStored = await ProductModel.find({});
        // console.log(productStored[getRandom]);
        // console.log('---------productCounter---22222------');
        // const productStored222 = await ProductModel.aggregate([
        //     {$match:{rnd: 3 }},
        //     {$sample:{size: 1}}
        // ])

        return res.status(200).json({
            status: 'success',
            data: JSON.stringify(productStored[getRandom]),
            message: '------------'
                // productStored222:productStored222
                // productStored
        });

    } catch (error) {
        return res.status(404).json({
            status: 'ErrorCreatingProduct',
            data: null,
            message: 'Sorry we cannot find your info product.'
        });
    }
});

app.get('/deals-hot-today', async(req, res) => {

    try {

        let nowDate = moment();
        let productStored = await ProductModel.aggregate(
            [{
                    $match: {
                        is_hot: true,
                        has_offer: true,
                        stock: { $gte: 1 },
                        'offer.expire': { $gte: nowDate.format('YYYY-MM-DD') },
                    }
                },
                { $limit: 100 },
                { $sort: { "price": -1 } },

                {
                    $lookup: {
                        from: "product_images",
                        localField: "_id",
                        foreignField: "product",
                        as: "images"
                    }
                }
            ]
        );

        const opts = [
            { path: 'category', select: 'directory title url' },
            { path: 'root_subcategory', select: 'directory heading menu_items url' },
            // {
            //     path: 'thumbnail',
            //     // select: 'directory heading menu_items url'
            // },
        ]


        await (await ProductModel.populate(productStored, opts)).map(dt => {

            // console.log('---------1111JENSYYYYYYYYYYYYYYYYYY---------');
            // console.log(dt.reviews.length);
            // console.log('---------2222JENSYYYYYYYYYYYYYYYYYY---------');
            if (dt.reviews.length > 0) {
                // console.log('---------dt.reviews---------');
                // console.log(dt.reviews);
                // console.log('---------dt.reviews---------');
                let rev = {

                    // reviews5: {
                    //     totalReviews: 0,
                    //     reviewers: 0
                    // },
                    // reviews4: {
                    //     totalReviews: 0,
                    //     reviewers: 0
                    // },
                    // reviews3: {
                    //     totalReviews: 0,
                    //     reviewers: 0
                    // },
                    // reviews2: {
                    //     totalReviews: 0,
                    //     reviewers: 0
                    // },
                    // reviews1: {
                    //     totalReviews: 0,
                    //     reviewers: 0
                    // },
                    // reviews4: 0,
                    // reviews3: 0,
                    // reviews2: 0,
                    // reviews1: 0,
                };
                let totalReviews = 0;
                for (let i = 0; i < dt.reviews.length; i++) {
                    const iterator = dt.reviews[i];
                    totalReviews += iterator.review;
                    // if (iterator.review === 5) {
                    //     // console.log('---------55---------');
                    //     rev.reviews5.totalReviews += iterator.review;
                    //     rev.reviews5.reviewers += 1;
                    //     // rev.reviews5 += iterator.review;
                    // }
                    // if (iterator.review === 4) {
                    //     rev.reviews4.totalReviews += iterator.review;
                    //     rev.reviews4.reviewers += 1;
                    //     // rev.reviews4 += iterator.review;
                    // }
                    // if (iterator.review === 3) {
                    //     rev.reviews3.totalReviews += iterator.review;
                    //     rev.reviews3.reviewers += 1;
                    //     // rev.reviews3 += iterator.review;
                    // }
                    // if (iterator.review === 2) {
                    //     rev.reviews2.totalReviews += iterator.review;
                    //     rev.reviews2.reviewers += 1;
                    //     // rev.reviews2 += iterator.review;
                    // }
                    // if (iterator.review === 1) {
                    //     rev.reviews1.totalReviews += iterator.review;
                    //     rev.reviews1.reviewers += 1;
                    //     // rev.reviews1 += iterator.review;
                    // }
                }

                dt.reviews = [{
                    totalReviews: totalReviews,
                    totalReviewers: dt.reviews.length,
                    ...rev
                }];
            }

            dt.images = dt.images.filter(img => {
                if (img.image_type === "images") {
                    return img
                }
                return
            })
            return dt;
        });
        const GHelpers = new GlobalHelpers();
        const productSelected = JSON.parse(JSON.stringify(productStored));
        await GHelpers.getArrayUrlFromRootSubCategory(productSelected);

        return res.status(200).json({
            success: true,
            data: productSelected,
            message: null
        });

    } catch (error) {
        // console.log("error", error)
        return res.status(404).json({
            status: 'ErrorDealsHotToday',
            data: null,
            message: 'Sorry we cannot find your product info.'
        });
    }
});

/*
app.get('/best-seller-items-from-category/:bycategory', [BestSellerItemsFromCat], async(req, res) => {

    try {

        let nowDate = moment();
        let { _id, title } = req.bestSaleItemsByCat;
        // const productStored = await ProductModel.find( { is_hot:true, has_offer:true, inventory:{ $gte: 1 }, 'offer.expire':{ $gte: nowDate.format('YYYY-MM-DD') } })
        // .populate('category');

        const paterned = new RegExp(title);
        // let Category = await Categories.find({ _id, title: { $regex:paterned, $options:'i'}}, 'view title image url subMenuContent');

        const optionsPopulate = [
            { path: 'category' },
            { path: 'root_subcategory' },
            { path: 'store' },
            {
                path: 'thumbnail',
                // select: 'directory heading menu_items url'
            },
        ]
        const productStored = await ProductModel.find({ category: _id }).sort({ count_sales: 'desc' }).limit(9)
            .populate(optionsPopulate);
        // console.log("productStored", productStored)
        const GHelpers = new GlobalHelpers();

        let productSelected = JSON.parse(JSON.stringify(productStored));
        let newArray = [];
        for (const iterator of productSelected) {
            let rr = iterator.root_subcategory.menu_items.find(mn => {
                if (mn._id === iterator.subcategory) {
                    return mn
                }
            })
            iterator.root_subcategory.menu_items = rr;
            newArray.push({
                ...iterator,
            })
        }
        return res.status(200).json({
            status: 'success',
            // data:productStored,
            data: JSON.stringify(newArray),
            message: ''
                // productStored222:productStored222
                // productStored
        });

    } catch (error) {
        console.log("error", error)
        return res.status(404).json({
            status: 'ErrorBestSellerItemsFromCategory',
            data: null,
            message: 'Sorry we cannot find your best seller items.'
        });
    }
})

app.get('/best-seller-by-subcategory-product/:bycategory', [BestSellerItemsFromCat], async(req, res) => {

    try {

        let { categoryId, subcategory } = req.bestSaleItemsByCat;
        // const paterned = new RegExp(title);
        const populateOpts = [
            { path: 'category' },
            {
                path: 'root_subcategory',
            },
            { path: 'store' },
            { path: 'thumbnail' }
        ]
        const productStored = await ProductModel.find({ category: categoryId, subcategory: subcategory._id }).sort({ count_sales: 'desc' }).limit(9)
            .populate(populateOpts);

        const GHelpers = new GlobalHelpers();
        let productSelected = JSON.parse(JSON.stringify(productStored));
        let newArray = [];
        for (const iterator of productSelected) {
            let rr = iterator.root_subcategory.menu_items.find(mn => {
                if (mn._id === iterator.subcategory) {
                    return mn
                }
            })
            iterator.root_subcategory.menu_items = rr;
            newArray.push({
                ...iterator,
            })
        }
        //.populate({path:'root_subcategory'})

        return res.status(200).json({
            status: 'success',
            data: JSON.stringify(newArray),
            message: ''
        });

    } catch (error) {
        console.log("error", error)
        return res.status(404).json({
            status: 'ErrorBestSellerItemsFromCategory',
            data: null,
            message: 'Sorry we cannot find your best sellers info product.'
        });
    }
})

app.get('/best-seller-items-by-subcategory/:bycategory', [BestSellerItemsFromCat], async(req, res) => {

    try {

        let nowDate = moment();
        let { _id, title, rootsubcategory } = req.bestSaleItemsByCat;
        // const productStored = await ProductModel.find( { is_hot:true, has_offer:true, inventory:{ $gte: 1 }, 'offer.expire':{ $gte: nowDate.format('YYYY-MM-DD') } })
        // .populate('category');

        const paterned = new RegExp(title);
        // const subcategoryPatern = new RegExp(rootsubcategory);
        // let Category = await Categories.find({ _id, title: { $regex:paterned, $options:'i'}, 'subMenuContent.heading':{ $regex: subcategoryPatern, $options:'i'} }, 'view title image url subMenuContent');

        const populateOpts = [
            { path: 'category' },
            {
                path: 'root_subcategory',
                // match:{ 'root_subcategory.text':'Electronic'  }
            },
            { path: 'store' },
            { path: 'thumbnail' }
        ]
        const productStored = await ProductModel.find({ category: _id, root_subcategory: rootsubcategory._idRootCat }).sort({ count_sales: 'desc' }).limit(9)
            .populate(populateOpts);

        const GHelpers = new GlobalHelpers();
        let productSelected = JSON.parse(JSON.stringify(productStored));
        let newArray = [];
        for (const iterator of productSelected) {
            let rr = iterator.root_subcategory.menu_items.find(mn => {
                if (mn._id === iterator.subcategory) {
                    return mn
                }
            })
            iterator.root_subcategory.menu_items = rr;
            newArray.push({
                ...iterator,
            })
        }
        //.populate({path:'root_subcategory'})

        return res.status(200).json({
            status: 'success',
            // data:productStored,
            data: JSON.stringify(newArray),
            message: ''
                // productStored222:productStored222
                // productStored
        });

    } catch (error) {
        console.log("error", error)
        return res.status(404).json({
            status: 'ErrorBestSellerItemsFromCategory',
            data: null,
            message: 'Sorry we cannot complete your request, to find best sellers by category.'
        });
    }
})

app.get('/recommended-items-from-category/:bycategory', [BestSellerItemsFromCat], async(req, res) => {

    try {

        let nowDate = moment();
        let { _id, title } = req.bestSaleItemsByCat;
        // const productStored = await ProductModel.find( { is_hot:true, has_offer:true, inventory:{ $gte: 1 }, 'offer.expire':{ $gte: nowDate.format('YYYY-MM-DD') } })
        // .populate('category');

        const paterned = new RegExp(title);
        // let Category = await Categories.find({ _id, title: { $regex:paterned, $options:'i'}}, 'view title image url subMenuContent');

        const populateOpts = [
            { path: 'category' },
            { path: 'root_subcategory' },
            { path: 'store' },
            {
                path: 'thumbnail',
                // select: 'directory heading menu_items url'
            },
        ]

        const productStored = await ProductModel.find({ category: _id }).sort({ viewed: 'desc' }).limit(9)
            .populate(populateOpts);
        const GHelpers = new GlobalHelpers();

        let productSelected = JSON.parse(JSON.stringify(productStored));
        let newArray = [];
        for (const iterator of productSelected) {
            let rr = iterator.root_subcategory.menu_items.find(mn => {
                if (mn._id === iterator.subcategory) {
                    return mn
                }
            })
            iterator.root_subcategory.menu_items = rr;
            newArray.push({
                ...iterator,
            })
        }

        return res.status(200).json({
            status: 'success',
            // data:productStored,
            data: JSON.stringify(newArray),
            message: ''
                // productStored222:productStored222
                // productStored
        });

    } catch (error) {
        console.log("error", error)
        return res.status(404).json({
            status: 'ErrorBestSellerItemsFromCategory',
            data: null,
            message: 'Sorry we cannot find your recommended products.'
        });
    }
})

app.get('/recommended-items-by-subcategory-product/:bycategory', [BestSellerItemsFromCat], async(req, res) => {

    try {
        let { categoryId, subcategory } = req.bestSaleItemsByCat;
        const populateOpts = [
            { path: 'category' },
            { path: 'root_subcategory' },
            { path: 'store' },
            {
                path: 'thumbnail',
                // select: 'directory heading menu_items url'
            }
        ]
        const productStored = await ProductModel.find({ category: categoryId, subcategory: subcategory._id }).sort({ viewed: 'desc' }).limit(9)
            .populate(populateOpts);
        const GHelpers = new GlobalHelpers();
        let productSelected = JSON.parse(JSON.stringify(productStored));
        let newArray = [];
        for (const iterator of productSelected) {

            let rr = iterator.root_subcategory.menu_items.find(mn => {

                if (mn._id === iterator.subcategory) {
                    return mn
                }
            })

            iterator.root_subcategory.menu_items = rr;
            newArray.push({
                ...iterator,
            })
        }
        //.populate({path:'root_subcategory'})

        return res.status(200).json({
            status: 'success',
            // data:productStored,
            data: JSON.stringify(newArray),
            message: ''
        });

    } catch (error) {
        console.log("error", error)
        return res.status(404).json({
            status: 'ErrorBestSellerItemsFromCategory',
            data: null,
            message: 'Sorry we cannot find your best sellers products.'
        });
    }
})

app.get('/recommended-items-by-subcategory/:bycategory', [BestSellerItemsFromCat], async(req, res) => {

    try {

        let nowDate = moment();
        // let { _id, title, subcategory } = req.bestSaleItemsByCat;
        let { _id, title, rootsubcategory } = req.bestSaleItemsByCat;
        // console.log(sl);

        // const productStored = await ProductModel.find( { is_hot:true, has_offer:true, inventory:{ $gte: 1 }, 'offer.expire':{ $gte: nowDate.format('YYYY-MM-DD') } })
        // .populate('category');

        const paterned = new RegExp(title);
        // let Category = await Categories.find({ _id, title: { $regex:paterned, $options:'i'}}, 'view title image url subMenuContent');

        const populateOpts = [
            { path: 'category' },
            { path: 'root_subcategory' },
            { path: 'store' },
            {
                path: 'thumbnail',
                // select: 'directory heading menu_items url'
            }
        ]
        const productStored = await ProductModel.find({ category: _id, root_subcategory: rootsubcategory._idRootCat }).sort({ viewed: 'desc' }).limit(9)
            .populate(populateOpts);
        // console.log("productStored", productStored)
        const GHelpers = new GlobalHelpers();

        let productSelected = JSON.parse(JSON.stringify(productStored));
        let newArray = [];
        for (const iterator of productSelected) {
            let rr = iterator.root_subcategory.menu_items.find(mn => {
                if (mn._id === iterator.subcategory) {
                    return mn
                }
            })
            iterator.root_subcategory.menu_items = rr;
            newArray.push({
                ...iterator,
            })
        }
        //.populate({path:'root_subcategory'})

        return res.status(200).json({
            status: 'success',
            // data:productStored,
            data: JSON.stringify(newArray),
            message: ''
                // productStored222:productStored222
                // productStored
        });

    } catch (error) {
        console.log("error", error)
        return res.status(404).json({
            status: 'ErrorBestSellerItemsFromCategory',
            data: null,
            message: 'Sorry we cannot find your recommended items by category.'
        });
    }
})

app.get('/product-list-from-category/:bycategory', [BestSellerItemsFromCat], async(req, res) => {

    try {

        let nowDate = moment();
        // console.log('---------moment---------');
        // console.log(nowDate.format('YYYY-MM-DD'));
        // console.log('---------moment---------');

        let { _id, title, typeView, pageSize, nextPage } = req.bestSaleItemsByCat;
        // const productStored = await ProductModel.find( { is_hot:true, has_offer:true, inventory:{ $gte: 1 }, 'offer.expire':{ $gte: nowDate.format('YYYY-MM-DD') } })
        // .populate('category');

        const paterned = new RegExp(title);
        // let Category = await Categories.find({ _id, title: { $regex:paterned, $options:'i'}}, 'view title image url subMenuContent');


        let sorter = {}
        let searchType = {}
        if (typeView === 'latest') {
            sorter.createdAt = 'desc';
            searchType = { category: _id }
        }
        if (typeView === 'lowtohighprice') {
            sorter.price = 'asc';
            searchType = { category: _id }
        }
        if (typeView === 'hightolowprice') {
            sorter.price = 'desc';
            searchType = { category: _id }
        }
        if (typeView === 'rating') {
            searchType = { category: _id }
            sorter.reviewsTotalGross = 'desc';
        }

        if (pageSize > 200) {
            pageSize = 65;
        }

        if (nextPage >= pageSize) {
            return res.status(404).json({
                // status:'ErrorBestSellerItemsFromCategory',
                status: 'ErrorItemsFromCategory',
                data: null,
                message: 'Sorry we cannot find your the products of list.'
            });
        }

        const populateOpts = [
            { path: 'category' },
            { path: 'root_subcategory' },
            { path: 'store' },
            { path: 'thumbnail' }
        ]
        const productStored = await ProductModel.find(searchType).sort(sorter).skip(nextPage).limit(pageSize)
            .populate(populateOpts);
        const GHelpers = new GlobalHelpers();
        // let newData = JSON.parse(JSON.stringify(productStored))

        // let newArray = [];
        // for (let iterData of newData) {
        //     const respReviews = await GHelpers.reviewsProccessByObject(iterData.reviews);
        //     iterData.reviews = respReviews;
        //     newArray.push({
        //         ...iterData,
        //         // iterData:respReviews
        //     })
        // }
        let productSelected = JSON.parse(JSON.stringify(productStored));
        let newArray = [];
        for (const iterator of productSelected) {
            let rr = iterator.root_subcategory.menu_items.find(mn => {
                if (mn._id === iterator.subcategory) {
                    return mn
                }
            })
            iterator.root_subcategory.menu_items = rr;
            newArray.push({
                ...iterator,
            })
        }
        //.populate({path:'root_subcategory'})

        return res.status(200).json({
            status: 'success',
            // data:productStored,
            data: JSON.stringify(newArray),
            totalItems: newArray.length,
            message: ''
        });

    } catch (error) {
        console.log("error", error)
        return res.status(404).json({
            // status:'ErrorBestSellerItemsFromCategory',
            status: 'ErrorItemsFromCategory',
            data: null,
            message: 'Sorry we cannot find your product list subcategory.'
        });
    }
})

app.get('/product-list-by-subcategory/:bycategory', [BestSellerItemsFromCat], async(req, res) => {

    try {

        let nowDate = moment();
        let { _id, title, rootsubcategory, typeView, pageSize, nextPage } = req.bestSaleItemsByCat;
        // console.log("req.bestSaleItemsByCat", nextPage)
        // console.log(sl);

        // const productStored = await ProductModel.find( { is_hot:true, has_offer:true, inventory:{ $gte: 1 }, 'offer.expire':{ $gte: nowDate.format('YYYY-MM-DD') } })
        // .populate('category');

        // const paterned = new RegExp(rootsubcategory);
        // let Category = await Categories.find({ _id, title: { $regex:paterned, $options:'i'}}, 'view title image url subMenuContent');

        let sorter = {}
        let searchType = {}
        if (typeView === 'latest') {
            sorter.createdAt = 'desc';
            searchType = { category: _id, root_subcategory: rootsubcategory._id }
        }
        if (typeView === 'lowtohighprice') {
            sorter.price = 'asc';
            searchType = { category: _id, root_subcategory: rootsubcategory._id }
        }
        if (typeView === 'hightolowprice') {
            sorter.price = 'desc';
            searchType = { category: _id, root_subcategory: rootsubcategory._id }
        }
        if (typeView === 'rating') {
            searchType = { category: _id, root_subcategory: rootsubcategory._id }
            sorter.reviewsTotalGross = 'desc';
        }

        if (pageSize > 200) {
            pageSize = 65;
        }

        if (nextPage >= pageSize) {
            return res.status(404).json({
                // status:'ErrorBestSellerItemsFromCategory',
                status: 'ErrorItemsFromCategory',
                data: null,
                message: 'Sorry we cannot find your list of product by subcategory.'
            });
        }

        const populateOpts = [
            { path: 'category' },
            { path: 'root_subcategory' },
            { path: 'store' },
            {
                path: 'thumbnail',
                // select: 'directory heading menu_items url'
            }
        ]
        const productStored = await ProductModel.find(searchType).sort(sorter).skip(nextPage).limit(pageSize)
            .populate(populateOpts);
        // console.log("productStored", productStored)
        // const GHelpers = new GlobalHelpers();
        // let newData = JSON.parse(JSON.stringify(productStored))

        // let newArray = [];
        // for (let iterData of newData) {
        //     const respReviews = await GHelpers.reviewsProccessByObject(iterData.reviews);
        //     iterData.reviews = respReviews;
        //     newArray.push({
        //         ...iterData,
        //         // iterData:respReviews
        //     })
        // }
        let productSelected = JSON.parse(JSON.stringify(productStored));
        let newArray = [];
        for (const iterator of productSelected) {
            let rr = iterator.root_subcategory.menu_items.find(mn => {
                if (mn._id === iterator.subcategory) {
                    return mn
                }
            })
            iterator.root_subcategory.menu_items = rr;
            newArray.push({
                ...iterator,
            })
        }
        //.populate({path:'root_subcategory'})

        return res.status(200).json({
            status: 'success',
            // data:productStored,
            data: JSON.stringify(newArray),
            totalItems: newArray.length,
            message: ''
                // productStored222:productStored222
                // productStored
        });

    } catch (error) {
        console.log("error", error)
        return res.status(404).json({
            // status:'ErrorBestSellerItemsFromCategory',
            status: 'ErrorItemsFromCategory',
            data: null,
            message: 'Sorry we cannot find your category list products.'
        });
    }
})

app.get('/product-list-by-subcategory-product/:bycategory', [BestSellerItemsFromCat], async(req, res) => {

    try {
        let { _id, subcategory, typeView, pageSize, nextPage } = req.bestSaleItemsByCat;
        let sorter = {}
        let searchType = {}
        if (typeView === 'latest') {
            sorter.createdAt = 'desc';
            searchType = { category: _id, subcategory: subcategory._id }
        }
        if (typeView === 'lowtohighprice') {
            sorter.price = 'asc';
            searchType = { category: _id, subcategory: subcategory._id }
        }
        if (typeView === 'hightolowprice') {
            sorter.price = 'desc';
            searchType = { category: _id, subcategory: subcategory._id }
        }
        if (typeView === 'rating') {
            searchType = { category: _id, subcategory: subcategory._id }
            sorter.reviewsTotalGross = 'desc';
        }

        if (pageSize > 200) {
            pageSize = 65;
        }

        if (nextPage >= pageSize) {
            return res.status(404).json({
                // status:'ErrorBestSellerItemsFromCategory',
                status: 'ErrorItemsFromCategory',
                data: null,
                message: 'Sorry we cannot find your info product by.'
            });
        }
        const populateOpts = [
            { path: 'category' },
            {
                path: 'root_subcategory',
            },
            { path: 'store' },
            { path: 'thumbnail' }
        ]
        const productStored = await ProductModel.find(searchType).sort(sorter).skip(nextPage).limit(pageSize)
            .populate(populateOpts);

        let productSelected = JSON.parse(JSON.stringify(productStored));
        let newArray = [];
        for (const iterator of productSelected) {
            let rr = iterator.root_subcategory.menu_items.find(mn => {
                if (mn._id === iterator.subcategory) {
                    return mn
                }
            })

            iterator.root_subcategory.menu_items = rr;
            newArray.push({
                ...iterator,
            })
        }
        //.populate({path:'root_subcategory'})
        return res.status(200).json({
            status: 'success',
            data: JSON.stringify(newArray),
            totalItems: newArray.length,
            message: ''
        });

    } catch (error) {
        console.log("error", error)
        return res.status(404).json({
            // status:'ErrorBestSellerItemsFromCategory',
            status: 'ErrorItemsFromCategory',
            data: null,
            message: 'Sorry we cannot find your product list by subcategory products.'
        });
    }
})

//==============================
// Start get one product by id
//==============================

app.get('/product/:productId', [GetProductById], async(req, res) => {

    try {

        let { _id } = req.productData;
        // const productStored = await ProductModel.find( { is_hot:true, has_offer:true, inventory:{ $gte: 1 }, 'offer.expire':{ $gte: nowDate.format('YYYY-MM-DD') } })
        // .populate('category');

        // const paterned = new RegExp(title);
        // let Category = await Categories.find({ _id, title: { $regex:paterned, $options:'i'}}, 'view title image url subMenuContent');
        const populateOpts = [
            { path: 'category' },
            { path: 'root_subcategory' },
            { path: 'store' },
            { path: 'thumbnail' },
            {
                path: 'variants.img',
                // select:'directory title url'
            },
            {
                path: 'variants.product_size.size_id',
                // select:'directory title url'
            }
        ]

        const productStored = await ProductModel.findOne({ _id })
            .populate(populateOpts);
        const GHelpers = new GlobalHelpers();

        let productSelected = JSON.parse(JSON.stringify(productStored));
        productSelected.root_subcategory.menu_items = productSelected.root_subcategory.menu_items.find(mn => {
                if (mn._id === productSelected.subcategory) {
                    return mn;
                }
            })
            // console.log("rr", rr)
            // for (const iterator of productSelected) {
            //     let rr = iterator.root_subcategory.menu_items.find(mn => {
            //         if (mn._id === iterator.subcategory) {
            //             return mn;
            //         }
            //     })
            //     iterator.root_subcategory.menu_items = rr;
            //     newArray.push({
            //         ...iterator,
            //     })
            // }

        return res.status(200).json({
            status: 'success',
            // data:productSelected,
            data: JSON.stringify(productSelected),
            message: ''
        });

    } catch (error) {
        console.log("error", error)
        return res.status(404).json({
            status: 'ErrorInvalidItemsDetails',
            data: null,
            message: 'Sorry we cannot find the product'
        });
    }
})

app.get('/frequently-bought-together/:productId', [GetProductById], async(req, res) => {

    try {

        let { _id, category_id } = req.productData;
        // const productStored = await ProductModel.find( { is_hot:true, has_offer:true, inventory:{ $gte: 1 }, 'offer.expire':{ $gte: nowDate.format('YYYY-MM-DD') } })
        // .populate('category');

        // const paterned = new RegExp(title);
        // let Category = await Categories.find({ _id, title: { $regex:paterned, $options:'i'}}, 'view title image url subMenuContent');
        const populateOpts = [
            { path: 'category' },
            { path: 'root_subcategory' },
            // { path: 'store'},
            { path: 'thumbnail' },
            {
                path: 'variants.img',
                // select:'directory title url'
            },
            {
                path: 'variants.product_size.size_id',
                // select:'directory title url'
            }
        ]

        // ,title:title

        const productStored = await ProductModel.find({ _id: { $ne: _id }, category: category_id }).limit(20).sort({ viewed: 'desc' })
            .populate(populateOpts)
            // console.log("productStored", productStored)
        const GHelpers = new GlobalHelpers();
        const randomN = Math.floor(Math.random() * productStored.length)
            // console.log('---------productStored.length---------');
            // console.log(randomN);
            // console.log(productStored.length);
            // console.log(productStored);
            // console.log('---------productStored.length---------');
        let productSelected = JSON.parse(JSON.stringify(productStored[randomN]));

        productSelected.root_subcategory.menu_items = productSelected.root_subcategory.menu_items.find(mn => {
            if (mn._id === productSelected.subcategory) {
                return mn;
            }
        })

        // console.log("rr", rr)
        // let newArray = [];
        // for (const iterator of productSelected) {
        //     let rr = iterator.root_subcategory.menu_items.find(mn => {
        //         if (mn._id === iterator.subcategory) {
        //             return mn;
        //         }
        //     })
        //     iterator.root_subcategory.menu_items = rr;
        //     newArray.push({
        //         ...iterator,
        //     })
        // }

        return res.status(200).json({
            status: 'success',
            // data:productSelected,
            data: JSON.stringify(productSelected),
            message: ''
        });

    } catch (error) {
        console.log("error", error)
        return res.status(404).json({
            status: 'ErrorProductsBougthTogether',
            data: null,
            message: 'Sorry we cannot find the product'
        });
    }
})


app.get('/same-brand/:productId', [GetProductById], async(req, res) => {

    try {

        let { _id, brand } = req.productData;
        const populateOpts = [
            { path: 'category' },
            { path: 'root_subcategory' },
            { path: 'store' },
            { path: 'thumbnail' },
        ]

        const productStored = await ProductModel.find({ _id: { $ne: _id }, brand }).limit(3).sort({ viewed: 'desc' })
            .populate(populateOpts)
        const GHelpers = new GlobalHelpers();
        let productSelected = JSON.parse(JSON.stringify(productStored));

        // productSelected.root_subcategory.menu_items = productSelected.root_subcategory.menu_items.find(mn => {
        //     if (mn._id === productSelected.subcategory) {
        //         return mn;
        //     }
        // })

        // console.log("rr", rr)
        let newArray = [];
        for (const iterator of productSelected) {
            let rr = iterator.root_subcategory.menu_items.find(mn => {
                if (mn._id === iterator.subcategory) {
                    return mn;
                }
            })
            iterator.root_subcategory.menu_items = rr;
            newArray.push({
                ...iterator,
            })
        }

        return res.status(200).json({
            status: 'success',
            // data:productSelected,
            data: JSON.stringify(productSelected),
            message: ''
        });

    } catch (error) {
        console.log("error", error)
        return res.status(404).json({
            status: 'ErrorProductsRelateds',
            data: null,
            message: 'Sorry we cannot find the product'
        });
    }
})

app.get('/relateds/:productId', [GetProductById], async(req, res) => {
    try {

        let { _id, category_id } = req.productData;
        const populateOpts = [
            { path: 'category' },
            { path: 'root_subcategory' },
            { path: 'store' },
            { path: 'thumbnail' },
        ]

        const productStored = await ProductModel.find({ _id: { $ne: _id }, category: category_id }).limit(9).sort({ viewed: 'desc' })
            .populate(populateOpts)
        const GHelpers = new GlobalHelpers();
        let productSelected = JSON.parse(JSON.stringify(productStored));

        // productSelected.root_subcategory.menu_items = productSelected.root_subcategory.menu_items.find(mn => {
        //     if (mn._id === productSelected.subcategory) {
        //         return mn;
        //     }
        // })

        // console.log("rr", rr)
        let newArray = [];
        for (const iterator of productSelected) {
            let rr = iterator.root_subcategory.menu_items.find(mn => {
                if (mn._id === iterator.subcategory) {
                    return mn;
                }
            })
            iterator.root_subcategory.menu_items = rr;
            newArray.push({
                ...iterator,
            })
        }
        return res.status(200).json({
            status: 'success',
            // data:productSelected,
            data: JSON.stringify(productSelected),
            message: ''
        });

    } catch (error) {
        console.log("error", error)
        return res.status(404).json({
            status: 'ErrorProductsSameBrand',
            data: null,
            message: 'Sorry we cannot find the product'
        });
    }
})

app.get('/customer-also-bought/:productId', [GetProductById], async(req, res) => {

    try {

        let { _id } = req.productData;
        const populateOpts = [
            { path: 'category' },
            { path: 'root_subcategory' },
            { path: 'store' },
            { path: 'thumbnail' },
        ]

        const productStored = await ProductModel.find({ _id: { $ne: _id } }).limit(6).sort({ viewed: 'desc' })
            .populate(populateOpts)
        const GHelpers = new GlobalHelpers();
        let productSelected = JSON.parse(JSON.stringify(productStored));

        // productSelected.root_subcategory.menu_items = productSelected.root_subcategory.menu_items.find(mn => {
        //     if (mn._id === productSelected.subcategory) {
        //         return mn;
        //     }
        // })

        // console.log("rr", rr)
        let newArray = [];
        for (const iterator of productSelected) {
            let rr = iterator.root_subcategory.menu_items.find(mn => {
                if (mn._id === iterator.subcategory) {
                    return mn;
                }
            })
            iterator.root_subcategory.menu_items = rr;
            newArray.push({
                ...iterator,
            })
        }
        return res.status(200).json({
            status: 'success',
            // data:productSelected,
            data: JSON.stringify(productSelected),
            message: ''
        });

    } catch (error) {
        console.log("error", error)
        return res.status(404).json({
            status: 'ErrorProductsCustomerAlsoBought',
            data: null,
            message: 'Sorry we cannot find the product'
        });
    }
})

app.patch('/set-product-viewed/:productId', [GetProductById], async(req, res) => {

    try {
        let { _id } = req.productData;
        const productStored = await ProductModel.updateOne({ _id: _id }, { $inc: { viewed: 1 } });

        return res.status(200).json({
            status: 'success',
            // data:productSelected,
            data: productStored,
            message: ''
        });

    } catch (error) {
        console.log("error", error)
        return res.status(404).json({
            status: 'ErrorProductsCustomerAlsoBought',
            data: null,
            message: 'Sorry we cannot find the product'
        });
    }
})
*/
//==============================
// End get one product by id
//==============================

module.exports = app;