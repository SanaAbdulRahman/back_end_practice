const {Users, User}=require('../models/user');
const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken')

router.get(`/`,async(req,res)=>{
    const userList=await User.find().select('-passwordHash')
    // const userList=await User.find().select('-passwordHash name phone email');

    if(!userList){
        res.status(500).json({
            success:false
        })
    }
    res.send(userList);
})

router.get('/:id',async(req,res)=>{
    const user=await User.findById(req.params.id).select('-passwordHash');

    if(!user){
        res.status(500).json({message:"The user with the given ID was not found"})
    }
    res.status(200).send(user);
})
//POST
//Admin can add users
router.post('/',async(req,res)=>{
    let user=new User({
        name:req.body.name,
        email:req.body.email,
        passwordHash:bcrypt.hashSync(req.body.password, 10),
        phone:req.body.phone,
        isAdmin:req.body.isAdmin,
        apartment:req.body.apartment,
        city:req.body.city,
        street:req.body.street     
    })
    user=await user.save();

    if(!user){
        return res.status(404).send('The user cannot be created !');
    }
        res.send(user);
})
router.post('/login',async(req,res)=>{
    const secret=process.env.secret
    const user=await User.findOne({email:req.body.email})

    if(!user){
        return res.status(400).send('Invalid email ID');
    }
    if(user && bcrypt.compareSync(req.body.password,user.passwordHash)){
        const token=jwt.sign({
            userId:user.id,
            isAdmin:user.isAdmin
        },
        secret,
        {expiresIn:'1d'} 
        )
        res.status(200).send({user:user.email,token:token})
    }else{
        res.status(400).send('Password is wrong!')
    }
})
//POST 
//Users can register through this api
router.post('/register',async(req,res)=>{
    let user=new User({
        name:req.body.name,
        email:req.body.email,
        passwordHash:bcrypt.hashSync(req.body.password, 10),
        phone:req.body.phone,
        isAdmin:req.body.isAdmin,
        apartment:req.body.apartment,
        city:req.body.city,
        street:req.body.street     
    })
    user=await user.save();

    if(!user){
        return res.status(404).send('The user cannot be created !');
    }
        res.send(user);
})

router.get('/get/count', async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        
        if (userCount === undefined) {
            res.status(500).json({ success: false });
        } else {
            res.send({
                userCount: userCount
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
});

router.delete('/:id',(req,res)=>{
    User.findByIdAndRemove(req.params.id).then(user=>{
        if(user){
            return res.status(200).json({success:true,message:"The user is deleted"})
        }else{
        return res.status(404).json({success:false,message:"user not found"})
        }
    }).catch(err=>{
        return res.status(400).json({sccess:false,error:err})
    })
})

module.exports=router;