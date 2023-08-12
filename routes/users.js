const {Users, User}=require('../models/user');
const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const { check, validationResult } = require('express-validator');


router.get('/home',(req,res)=>{
    const user=req.session.user;
    if (!user) {
        return res.render('login'); // Redirect to your login page
    }
        res.render('home',{user});
        
 })

router.get('/login', (req, res) => {
    if (req.session.user) {
        return res.render('home'); // Redirect to your home page
    }
    res.render('login'); 
});


router.get('/adminLogin',(req,res)=>{
    res.render('admin-login');
})

router.get('/register', (req, res) => {
    if (req.session.user) {
        return res.render('home'); // Redirect to your home page
    }
    res.render('register',{errors:''}); 
});

//POST 
//Users can register through this api
 router.post('/register',
 [
 check('name').notEmpty().withMessage('Username is required'),
 check('email').isEmail().withMessage('Email is not valid'),
 check('phone').matches(/[0-9]{10}/).withMessage('Mobile number is not valid'),
 check('password').notEmpty().isLength({min :6}).withMessage('Password must be atleast 8 characters'),
 ],async(req,res)=>{
 
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        const alert = errors.array()
        // return res.render('register',{errors:errors.mapped()})
        return res.render('register',{alert})
    }
    
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            const alert = [{ msg: 'Email already registered' }];
            return res.render('register', { alert });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            passwordHash: hashedPassword,
            phone: req.body.phone,
        });

        await newUser.save();

        req.session.user = newUser; // Store user in session
        if(req.session.user){
        res.render('home');
        }
        else{
            res.render('register');
        }

    } catch (error) {
        console.error('Error while registering:', error);
        res.status(500).send('An error occurred during registration');
        
    }
});

router.post('/login', async (req, res) => {
  
    const { email,password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
            return res.render('login', { error: 'Invalid email or password' });
        }
        
        req.session.user = user; // Store user in session
        console.log(req.session.user);
        res.render('home'); // Redirect to your home page after successful login
       
        
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('An error occurred during login');
    }
});
// Logout route

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Error while logging out');
        }
        res.redirect('/api/v1/users/login'); // Redirect to your login page after logout
    });
});










//Admin dashboard with list of users
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
//Admin get users by id
router.get('/:id',async(req,res)=>{
    const user=await User.findById(req.params.id).select('-passwordHash');

    if(!user){
        res.status(500).json({message:"The user with the given ID was not found"})
    }
    res.status(200).send(user);
})
//POST
//Admin can add users
router.post('/' ,async(req,res)=>{

    let user=new User({
        name:req.body.name,
        email:req.body.email,
        passwordHash:bcrypt.hashSync(req.body.password, 10),
        phone:req.body.phone,
        isAdmin:req.body.isAdmin,
        // apartment:req.body.apartment,
        // city:req.body.city,
        // street:req.body.street     
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