const { Category } = require('../models/category');
const {Product}=require('../models/product');
const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');

//GET all the products in the collection
router.get('/',async (req,res)=>{
    // const productList=await Product.find().select('name image -_id price size');
    const productList=await Product.find().select('name image price size category').populate('category');// select('name image price size') will select all the fields given in the braces and prints only that values. if you dont want to print _id then we can give select('-_id name image price size category')
    if(!productList){
     res.status(500).json({success:false})
    }
     res.send(productList);
 })
 //GET 
 //single product by Id
 router.get('/:id',async (req,res)=>{
    const product=await Product.findById(req.params.id).populate('category')//populate('category') used to print all the category details with the category id. otherwise it return only the category id.
    if(!product){
     res.status(500).json({success:false})
    }
     res.send(product);
 })

 //GET filtering and getting products by category.
 //We have 3 ways to pass value to the backend.
 //1. url parameters (/:id  --> req.params.id)
 //2.body parameters (req.body.____)
 //3.query parameters  (url/products?category="656746567","858557")
 router.get('/',async (req,res)=>{
    let filter={};
   if(req.query.categories){
    filter={category:req.query.categories.split(',')}
   }
    const productList=await Product.find(filter).populate('category');
    if(!productList){
     res.status(500).json({success:false})
    }
     res.send(productList);
 })
 //POST
 //Create a new product
 router.post('/',async(req,res)=>{
    const category=await Category.findById(req.body.category);
    if(!category) return res.status(400).send("Invalid Category")
    let product=new Product({
     name:req.body.name,
     description:req.body.description,
     image:req.body.image,
     price:req.body.price,
     category:req.body.category,
     size:req.body.size,
     discount:req.body.discount,
     rating:req.body.rating,
     numReviews:req.body.numReviews,
     isFeatured:req.body.isFeatured
    })
    product=await product.save();
    
    if(!product)
    return res.status(500).send("The product cannot be created")
 
 res.send(product);
})
//Update or edit product by Id
router.put('/:id',async(req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send('Invalid product Id');
    }
    const category=await Category.findById(req.body.category);
    if(!category) return res.status(400).send("Invalid Category")
    const product=await Product.findByIdAndUpdate(
        req.params.id,
        { 
            name:req.body.name,
            description:req.body.description,
            image:req.body.image,
            price:req.body.price,
            category:req.body.category,
            size:req.body.size,
            discount:req.body.discount,
            rating:req.body.rating,
            numReviews:req.body.numReviews,
            isFeatured:req.body.isFeatured
        },
        {new:true}
        )
        if(!product){
            return res.status(500).send("There is no product with given id.So the product cannot be updated!");
        }
        res.send(product);
})
//DELETE product by Id
router.delete('/:id',(req,res)=>{
    Product.findByIdAndRemove(req.params.id).then(product=>{
        if(product){
            return res.status(200).json({success:true,message:"The product is deleted"})
        }else{
        return res.status(404).json({success:false,message:"product not found"})
        }
    }).catch(err=>{
        return res.status(400).json({sccess:false,error:err})
    })
})
//Get count of the products in the product collection
router.get('/get/count', async (req, res) => {
    try {
        const productCount = await Product.countDocuments();
        
        if (productCount === undefined) {
            res.status(500).json({ success: false });
        } else {
            res.send({
                productCount: productCount
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
});

//GET the featured products with a count.because not all the products to be shown in home page as featured product.
router.get('/get/featured/:count', async (req, res) => {
    const count=req.params.count ? req.params.count : 0
    try {
        const products = await Product.find({isFeatured:true }).limit(+count);
        //limit(count) here, the count has a string value. to convert it into number or integer we can give limit(+count)
        if (products === undefined) {
            res.status(500).json({ success: false });
        } else {
            res.send(products);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
});

 module.exports=router;