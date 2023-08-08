const mongoose=require('mongoose');
const productSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:''
           },
    images:[{
            type:String
           }],
    price:{
        type:Number,
        default:0
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true
    },
    size:[{
        type:String   //Pizza - small , medium or large
    }],
    discount:{
        type:Number
    },
    rating:{
        type:Number,
        default:0
    },
    numReviews:{
        type:Number,
        default:0
    },
    // isFeatured:{
    //     type:Boolean,
    //     default:false
    //     },
    createdAt:{
        type:Date,
        default:Date.now
    }
    // countInStock:{
    //     type:Number,
    //     required:true
    // }
})

exports.Product=mongoose.model('Product',productSchema);