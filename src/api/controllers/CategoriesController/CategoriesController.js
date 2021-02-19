'use strict'

const app = require('express')();
const { Categories, SubCategories } = require('../../models/categories/categories');
const { ProductModel } = require('../../models/products/products');
const GlobalHelpers = require('../../helpers/global-helpers');

//categories
app.post('/', async(req, res) => {
    //==============================
    // Start create categories, sub cat and sub menu
    //==============================

    const {
        title,
        image,
        subMenuContent,
        subClass,
        extraClass,
        url,
        icon,
        view,
        auth
    } = req.body;

    try {
        // console.log('---------req.body---------');
        // console.log(subMenuContent);
        // console.log('---------req.body---------');
        // const Category = await Categories();
        // Category.subMenuContent.push(JSON.parse(subMenuContent));

        const Category = await Categories.create({
                title,
                image,
                subMenuContent: subMenuContent ? JSON.parse(subMenuContent) : [],
                subClass: subClass,
                extraClass: extraClass,
                url,
                icon,
                view: view,
                auth
            })
            // const newSubMenuContent = Categories.subMenuContent.create(JSON.parse(subMenuContent));
            // Category.subMenuContent.push(JSON.parse(subMenuContent));
        return res.status(200).json({
            status: 'success',
            data: Category,
            message: null
        })

    } catch (error) {
        console.log("error", error)
        console.log("error", error)
        console.log("error", error)
        console.log("error", error)

        let { message, path } = error.errors.title.properties;
        console.log("error", error)
        if (path !== 'title') {
            return res.status(200).json({
                status: 'ErrorCreateCategory',
                data: null,
                message: 'Sorry we cannot create your category.'
            })
        }
        return res.status(200).json({
            status: 'ErrorCreateCategory',
            data: null,
            message: `${message}: ${title}`
        })
    }
});

app.get('/', async(req, res) => {
    //==============================
    // Start get categories
    //==============================
    try {
        // const Category = await Categories.find({}).populate({
        //     path:''
        // })
        // const Category = await SubCategories.find({}).populate({
        //     path:'category'
        // })
        const Category = await Categories.aggregate([{
            $lookup: {
                from: "subcategories",
                localField: "_id",
                foreignField: "category",
                as: "subCategories"
            }
        }])

        return res.status(200).json({
            data: Category,
            status: 'success',
            message: ''
        })

    } catch (error) {
        console.log("error", error)

        return res.status(404).json({
            status: 'ErrorFetchCategories',
            data: null,
            message: 'Sorry we cannot find your categories.'
        })

    }

});

app.get('/top-categories-of-the-month', async(req, res) => {
    //==============================
    // Start get categories
    //==============================
    try {
        let Category = await Categories.find({}, 'view title image url').sort({ view: 'desc' }).limit(8);

        const newArrCategories = JSON.parse(JSON.stringify(Category));
        let newArray = [];
        for (let iterator of newArrCategories) {
            const respProduct = await ProductModel.find({ 'category': iterator._id }).sort({ createdAt: '1' });
            iterator.product = respProduct;
            newArray.push({
                ...iterator
            })
        }

        return res.status(200).json({
            data: newArray,
            status: 'success',
            message: '',
        })

    } catch (error) {
        console.log("error", error)

        return res.status(404).json({
            status: 'ErrorFetchCategories',
            data: null,
            message: 'Sorry we cannot find your categories.'
        })

    }

})

const generateDataShowCase = async(category) => {
    //==============================
    // Start add 6 product per category
    // of Show case block
    //==============================
    const optsPopulate = [{
            path: "root_subcategory",
            select: 'directory url heading menu_items',
        },
        { path: 'thumbnail' },
        { path: 'vertical_slider' },
        {
            path: 'category',
            select: 'directory title url'
        }
    ]
    let newArray = [];
    for (let iterData of category) {
        let respProduct = await ProductModel.find({ 'category': iterData._id })
            .populate(optsPopulate)
            .sort({ viewed: 'desc' }).limit(6);

        for (const iterData of respProduct) {
            //==============================
            // Start find product menu_item
            // find exact subcategory product
            //==============================
            iterData.root_subcategory.menu_items = iterData.root_subcategory.menu_items.find(it => {
                    if (it._id.toString() === iterData.subcategory.toString()) {
                        return it
                    }
                })
                //==============================
                // End find product menu_items
                // find exact subcategory product
                //==============================
        }

        if (respProduct.length > 0) {
            //==============================
            // Start add category if have product to show
            //==============================
            newArray.push({
                    ...iterData,
                    products: respProduct
                })
                //==============================
                // End add category if have product to show
                //==============================
        }
    }
    return newArray;
    //==============================
    // End add 6 product per category
    // of Show case block
    //==============================
}

app.get('/gray-categories-of-the-month', async(req, res) => {
    //==============================
    // Start get categories
    //==============================
    try {
        const GHelpers = new GlobalHelpers();
        //find({}, 'view title image url') 
        let category = await Categories.aggregate([{
                $lookup: {
                    from: 'subcategories',
                    localField: '_id',
                    foreignField: 'category',
                    as: 'categoriesList'
                },
            },


            // {
            //     $project:{
            //         "_id": 1,
            //         "url": 1,
            //         "directory": 1,
            //         "viewed": 1,
            //         "title": 1,
            //         "categoriesList":1
            //     }
            // }
            // ,
            // {
            //     $lookup:{
            //         from:'products',
            //         localField:'_id',
            //         foreignField:'category',
            //         as: 'product',
            //         // $sort:{viewed:'desc'},
            //         $limit:1
            //     },
            // },
            // ]).sort({viewed:'desc'}).limit(8);



        ]).project('title url viewed directory categoriesList.heading categoriesList.directory categoriesList._id categoriesList.url categoriesList.menu_items').sort({ viewed: 'desc' }).limit(8);


        // await generateDataShowCase
        let parsedData = JSON.parse(JSON.stringify(category));
        // for (const iterator of parsedData) {
        //     iterator.root_subcategory.menu_items
        //     await GHelpers.getArrayUrlFromRootSubCategory(productSelected);
        // }

        category = await generateDataShowCase(parsedData);


        // .populate({
        //     path:'category',
        //     select:'directory title url'  categoriesList.menu_items

        // }).populate({
        //     path:"root_subcategory",
        //     select:'directory heading menu_items url',
        // }).sort({viewed: 'desc' })


        // let newArrData = [];
        // for (const iterator of newArray) {
        //     let newArrDa = [];
        //     for (let ix = 0; ix < iterator.subMenuContent.length; ix++) {
        //         const items = iterator.subMenuContent[ix].menuItems;
        //         const [ infoX ] = items;
        //         newArrDa.push({text:infoX.text, url:infoX.url, directory:infoX.directory, _id:ix+1});
        //     }
        //     delete iterator.subMenuContent;
        //     newArrData.push({
        //         ...iterator,
        //         frontCategories:newArrDa
        //     })
        // }
        // const productSelected = JSON.parse(JSON.stringify(newArrData));
        // await GHelpers.getArrayUrlFromRootSubCategory(productSelected);

        return res.status(200).json({
            data: JSON.stringify(category),
            // dataxxx:category,          
            status: 'success',
            message: '',
            // newArrData
        })

    } catch (error) {
        console.log("error", error)
        return res.status(404).json({
            status: 'ErrorFetchCategories',
            data: null,
            message: 'Sorry we cannot find your categories.'
        })
    }
})

app.patch('/', async(req, res) => {
    //==============================
    // Start update categories
    //==============================
    try {
        let { _id, subMenuContent, hasItemsMenus, text, url } = req.body;

        // console.log("menuItems", menuItems)
        let respMenuItems = [];
        if (hasItemsMenus === 'true') {
            let obj = {
                _id: _id
            };

            if (text) {
                obj['subMenuContent.menuItems.text'] = text;
            }

            // if (url) {
            //     obj['subMenuContent.menuItems.url'] = url;
            // }
            // console.log(obj);
            // console.log(obj);
            // console.log(obj);
            // console.log(obj);

            // respMenuItems = await Categories.findOne(obj);
            const hasSubMenus = await Categories.findOne({ _id });

            if (!hasSubMenus || hasSubMenus.subMenuContent.length === 0) {
                // console.log('---------555555---------');
                // console.log(555555);
                // console.log(hasSubMenus.subMenuContent);
                // // console.log(respMenuItems.subMenuContent);
                // // console.log(respMenuItems);
                // console.log('---------555555---------');
                // const drespMenuItems = 
                await Categories.findOneAndUpdate({ _id: obj._id }, { $set: { subMenuContent: JSON.parse(subMenuContent) } });
                // console.log("drespMenuItems")
                // console.log(drespMenuItems);
                // console.log("drespMenuItems")
            }
            // else{
            //     respMenuItems = await Categories.findOne(obj);
            //     console.log("respMenuItems", respMenuItems)
            //     console.log("respMenuItems", respMenuItems)
            // }

            // respMenuItems = await Categories.findOne({_id:_id, 'subMenuContent.menuItems.text': 'Headphones'});
        }
        // const Category = await Categories.find({})
        // Categories.findOneAndUpdate({_id: _id}, { $set:{  } } )
        // Categories.findOneAndUpdate({_id:_id, 'subMenuContent.menuItems.text': }, { $set:{  } } )
        //{'subMenuContent.menuItems.text': ''} 

        return res.status(200).json({
            status: 'success',
            data: null,
            message: 'Request has been updated successfully.'
        })

    } catch (error) {

        console.log("error", error)
        return res.status(404).json({
            status: 'ErrorFetchCategories',
            data: null,
            message: 'Sorry we cannot find your categories.'
        })

    }

})

//==============================
// Start subcategories 
//==============================
app.patch('/new-sub-menu', async(req, res) => {
    //==============================
    // Start update subcategories
    //==============================

    try {
        let { _id, subMenuContent, heading } = req.body;

        const hasSubMenus = await Categories.findOne({ _id });

        if (!hasSubMenus || hasSubMenus.subMenuContent.length === 0) {

            return res.status(404).json({
                status: 'ErrorUpdateCategory',
                data: null,
                message: 'Sorry we cannot find your categories.'
            })
        }
        let respMenuItems = [];
        respMenuItems = await Categories.findOne({ _id: _id, 'subMenuContent.heading': heading });

        if (!respMenuItems || respMenuItems.subMenuContent.length === 0) {
            //==============================
            // console.log("subMenuContent", subMenuContent)
            // Start update or add just one element from heading
            //==============================

            //==============================
            // End update or add just one element from heading
            //==============================

        } else {
            // console.log('---------555555---------');
            // console.log(555555);
            // // console.log(respMenuItems);
            // console.log(subMenuContent);
            // console.log('---------555555---------');
            respMenuItems = await Categories.findOneAndUpdate({ _id: _id }, {
                $push: {
                    'subMenuContent': JSON.parse(subMenuContent)
                }
            });
        }


        // console.log("menuItems", menuItems)
        // if (hasItemsMenus === 'true') {
        // let obj = { 
        //     _id:_id 
        // };

        // if (text) {
        //     obj['subMenuContent.menuItems.text'] = text;
        // }
        // if (text) {
        //     obj['subMenuContent.menuItems'] = text;
        // }

        // if (url) {
        //     obj['subMenuContent.menuItems.url'] = url;
        // }
        // console.log(obj);
        // console.log(obj);
        // console.log(obj);
        // console.log(obj);

        // respMenuItems = await Categories.findOne(obj);

        // console.log(hasSubMenus.subMenuContent);
        // // console.log(respMenuItems.subMenuContent);
        // // console.log(respMenuItems);
        // const drespMenuItems = 
        // await Categories.findOneAndUpdate({_id:obj._id}, { $set:{ subMenuContent:JSON.parse(subMenuContent) } });
        // console.log("drespMenuItems")
        // console.log(drespMenuItems);
        // console.log("drespMenuItems")
        // }
        // const Category = await Categories.find({})
        // Categories.findOneAndUpdate({_id: _id}, { $set:{  } } )
        // Categories.findOneAndUpdate({_id:_id, 'subMenuContent.menuItems.text': }, { $set:{  } } )
        //{'subMenuContent.menuItems.text': ''} 

        return res.status(200).json({
            status: 'success',
            data: respMenuItems,
            message: 'Request has been updated successfully.'
        })

    } catch (error) {

        console.log("error", error)
        return res.status(404).json({
            status: 'ErrorFetchCategories',
            data: null,
            message: 'Sorry we cannot find your categories.'
        })

    }

})

//==============================
// Start subcategories 
//==============================
app.patch('/set-viewed/:category', async(req, res) => {
    //==============================
    // Start update subcategories
    //==============================

    try {
        let { category } = req.params;
        let { _id, title } = JSON.parse(category)
            // console.log("req.params", _id)
            // console.log("req.paramsqqq",title)

        // let countViewed = await Categories.findOne({_id:_id, title:title}, 'viewed');
        // let { viewed } = countViewed;
        // console.log("countViewed", countViewed)
        // console.log("countViewed", countViewed.viewed)

        // const hasSubMenus = await Categories.updateOne({_id:_id, title:title}, {$set:{viewed:viewed+1}});
        const hasSubMenus = await Categories.updateOne({ _id: _id, title: title }, { $inc: { viewed: 1 } });

        return res.status(200).json({
            status: 'success',
            data: null,
            message: 'Request has been updated successfully.'
        })

    } catch (error) {

        console.log("error", error)
        return res.status(404).json({
            status: 'ErrorFetchCategories',
            data: null,
            message: 'Sorry we cannot find your categories.'
        })

    }

})

/*************************************ADMIN SECTION***************************/

app.get('/get-categories', async(req, res) => {
    //==============================
    // Start get categories
    //==============================
    try {
        const Category = await Categories.find({});

        return res.status(200).json({
            data: Category,
            status: 'success',
            message: ''
        })

    } catch (error) {
        console.log("error", error)

        return res.status(404).json({
            status: 'ErrorFetchCategories',
            data: null,
            message: 'Sorry we cannot find your categories.'
        })

    }

});

app.get('/subcategories', async(req, res) => {
    //==============================
    // Start get categories
    //==============================

    // console.log('---------@@@@@@@@@@---------');
    // console.log(typeof req.query.id);
    // console.log('---------@@@@@@@@@@---------');

    if (typeof req.query.id !== 'string') {

        return res.status(401).json({
            status: 'ErrorFetchSubCategories',
            data: null,
            message: 'Sorry we cannot find sub categories.'
        });
    }

    try {
        const subCategory = await SubCategories.find({ category: req.query.id });
        return res.status(200).json({
            data: subCategory,
            ok: true,
            message: ''
        })
    } catch (error) {
        console.log("error", error)

        return res.status(404).json({
            status: 'ErrorFetchCategories',
            data: null,
            message: 'Sorry we cannot find your categories.'
        })
    }
});

app.post('/new-category', async(req, res) => {
    //==============================
    // Start create category
    //==============================
    const globalHelpers = new GlobalHelpers();
    const {
        // image,
        // subMenuContent,
        // subClass,
        // extraClass,
        // url,
        // description,
        title,
        icon,
    } = req.body;

    /*
        VALIDATIONS
        regex
    */

    try {
        //replace globaly spaces for -
        const titleTrim = title.trim();
        const directoryUrl = titleTrim.toLowerCase().replace(/\s/g, '-');
        //VERIFY IF START OR END WITH (-)
        if (globalHelpers.getStartOrEndWith(directoryUrl, '-', 'SE')) {
            return res.status(400).json({
                status: 'ErrorCreateCategory',
                data: null,
                message: 'Sorry we cannot create your category.',
                success: false
            });
        }
        if (globalHelpers.getStartOrEndWith(icon.toLowerCase().trim(), '-', 'SE')) {
            return res.status(400).json({
                status: 'ErrorCreateCategory',
                data: null,
                message: 'Sorry we cannot create your category.',
                success: false
            });
        }
        const iconName = icon.toLowerCase().trim();
        console.log(33);
        const category = await Categories.create({
            // image,
            // subClass: subClass,
            // extraClass: extraClass,
            title: titleTrim,
            subMenuContent: [],
            url: directoryUrl,
            directory: directoryUrl,
            icon: iconName,
            auth: '5f0222800a26fa59c8de2011'
        });

        console.log(44);
        // const newSubMenuContent = Categories.subMenuContent.create(JSON.parse(subMenuContent));
        // Category.subMenuContent.push(JSON.parse(subMenuContent));
        return res.status(200).json({
            status: 'success',
            data: category,
            message: `Category <strong>${titleTrim}</strong> has been created successfuly`,
            success: true
        })

    } catch (error) {
        // console.log('---------error---------');
        // console.log(error.errors);
        // console.log('---------error---------');

        // if (error.path === 'title') {
        // }
        return res.status(400).json({
            status: 'ErrorCreateCategory',
            data: null,
            message: `Sorry, we cannot create category <strong>${title}</strong>. or already exists.`,
            success: false
        })
    }
});

module.exports = app;