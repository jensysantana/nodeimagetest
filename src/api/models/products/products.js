'use strict'

const { model, Schema, Types } = require('mongoose');
const { bool } = require('sharp');
const { boolean } = require('yup');

// const { appConf } = //require('../../config/config');
const products = new Schema({
    title: { type: String, index: true },
    is_featured: { type: Boolean },
    is_hot: { type: Boolean, default: false }, //posible 
    price: { type: Number, require: [true, ''], maxlength: 14 },
    is_online_sale: { type: Boolean, default: false },
    publish_item_online: { type: Boolean, default: false },
    vendor: { type: String, require: [true, ''], maxlength: 60 },
    viewed: { type: Number, maxlength: 14, required: [true, ''] },
    reviews: [],
    reviewsTotal: { type: Number, }, //posible borrar
    reviewsTotalStars: { type: Number }, //posible borrar
    depot: { type: Number },
    start_inventory: { type: Number, require: [true, ''], maxlength: 14 },
    stock: { type: Number, require: [true, ''], maxlength: 14 },
    // is_out_of_stock: { type: Boolean, default: false },
    sold: { type: Boolean, default: false },
    // html_render: { type:String },
    variants_html: { type: String },
    variants: [{
        color: { type: String, maxlength: 20 },
        color_code: { type: String, maxlength: 10 },
        img: { type: Schema.Types.ObjectId, ref: 'Product_image', maxlength: 24 },
        isDefault: { type: Boolean, default: false },
        product_size: [{
            size_id: { type: Schema.Types.ObjectId, ref: 'Product_size', require: [true, ''], maxlength: 24 },
            price: { type: Number },
            stock: { type: Number },
            isDefault: { type: Boolean, default: false },
            // isDefault: false,
        }, ]
    }],
    images: { type: Object },
    // images: { type: Schema.Types.ObjectId, ref:'Product_image' },
    // images:[
    //     {
    //         // _id:{ type: String },
    //         // _id:{ type: Schema.Types.ObjectId, ref:'images' },
    //         name: { type:String },
    //         alternativeText: { type: String },
    //         caption: { type: String },
    //         width: { type: Number },
    //         height: { type: Number },
    //         formats: { type: String },
    //         hash: { type: String, maxlength:35 },
    //         ext: { type: String, maxlength:8 },
    //         mime: { type: String, maxlength:15 },
    //         size:{ type: Number },
    //         url:{ type: String, maxlength:80},
    //         previewUrl: { type: String, maxlength:80 },
    //         provider: { type: String, maxlength:45 },
    //         provider_metadata: { type: String, maxlength:100 },
    //         status: {type: Number, default: 1},
    //         is_active: { type:Boolean, default:false },
    //         activatedAt:{type: Date, default: null},
    //         createdAt:{type: Date, default: Date.now},
    //         updatedAt:{type: Date, default: null},
    //         deletedAt:{type: Date, default: null},
    //     } 
    // ],
    thumbnail: { type: Schema.Types.ObjectId, ref: 'Product_image', require: [true, ''] },
    categories: [
        { name: { type: String, maxlength: 30 }, slug: { type: String, maxlength: 30 }, description: { type: String, maxlength: 30 } }
    ],
    brands: [
        { name: { type: String, maxlength: 30 }, description: { type: String, maxlength: 30 }, slug: { type: String, maxlength: 30 } }
    ],
    collections: [ //posible borrar
        { name: { type: String, maxlength: 30 }, description: { type: String, maxlength: 30 }, slug: { type: String, maxlength: 30 } }
    ],
    feedback: { type: String, },
    store: { type: Schema.Types.ObjectId, ref: 'Store', require: [true, ''] },
    category: { type: Schema.Types.ObjectId, ref: 'Category', require: [true, ''] },
    subcategory: { type: Schema.Types.ObjectId, ref: 'Subcategory', require: [true, ''] },
    root_subcategory: { type: Schema.Types.ObjectId, ref: 'Subcategory', require: [true, ''] },
    // subcategory:{ type: String, require:[true, ''] },
    name: { type: String, },
    tags: [],
    url: { type: String, },
    shipping: { type: Number, maxlength: 14 },
    delivery_date: [],
    offer: [],
    has_offer: { type: Boolean },
    specification: { type: String },
    details: { type: String },
    description: { type: String },
    top_banner: {
        h3: { type: String },
        p1: { type: String },
        h4: { type: String },
        p2: { type: String },
        span: { type: String },
        button: { type: String },
        img: { type: Schema.Types.ObjectId, ref: 'Product_image', require: [true, ''] }
    },
    has_top_banner: { type: Boolean, require: [true, ''] },
    vertical_slider: { type: Schema.Types.ObjectId, ref: 'Product_image', require: [true, ''] },
    has_vertical_slider: { type: Boolean, require: [true, ''] },
    horizontal_slider: { type: String },
    has_horizontal_slider: { type: Boolean, require: [true, ''] },
    default_banner: { type: Schema.Types.ObjectId, ref: 'Product_image', require: [true, ''] },
    has_default_banner: { type: Schema.Types.ObjectId, ref: 'Product_image', require: [true, ''] },
    vertical_banner: { type: Schema.Types.ObjectId, ref: 'Product_image', require: [true, ''] },
    has_vertical_banner: { type: Boolean, require: [true, ''] },
    rnd: { type: Number }, //posible borrar
    // gallery:{ type: String, },
    // video:{ type: String, },
    status: { type: Number, default: 1 }, //published or unpublic
    is_active: { type: Boolean, default: false }, //seller use this status
    activatedAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: null },
    deletedAt: { type: Date, default: null },
    imgUrl: String,
});
// products.method.addRamdon = function addRamdon(rand){
//     console.log('---------rand---------');
//     console.log(rand);
//     console.log('---------rand---------');
// }
/*
products.methods.setImageUrl = function setImageUrl(filename){
    let { host, port  } = appConf;
    this.imgUrl = `${host}:${port}/api/public/${filename}`;
}

*/
module.exports = {
    ProductModel: model('Product', products),
};