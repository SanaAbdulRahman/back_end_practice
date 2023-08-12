const mongoose=require('mongoose');

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    passwordHash:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        unique:true,
        required:true
    },
    // street:{
    //     type:String,
    //     required:true
    // },
    // apartment:{
    //     type:String,
    //     required:true
    // },
    // city:{
    //     type:String,
    //     required:true
    // },
    isAdmin:{
        type:Boolean,
        default:false,
    }
   
})
userSchema.virtual('id').get(function(){
    return this._id.toHexString();
});
userSchema.set('toJSON',{
    virtuals:true,
});
exports.User=mongoose.model('User',userSchema);
exports.userSchema=userSchema;