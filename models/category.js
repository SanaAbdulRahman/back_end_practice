const mongoose=require('mongoose');

const categorySchema=mongoose.Schema({
        name:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    image:{
        type:String
    },
    isActive:{ 
      type:Boolean 
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    updatedAt:{
        type:Date,
        default:Date.now()
    }
})
exports.Category=mongoose.model('Category',categorySchema);