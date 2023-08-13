const {Admin}=require('../models/admin');
const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');


router.get('/adminLogin',(req,res)=>{
    res.render('admin-login');
})

router.post("/adminLogin",async (req, res) => {
    //const { username, password } = req.body;
    const name=req.body.name;
    const password=req.body.password;
    if(!name || !password){
        return res.render("admin-login",{error:"Please enter username or password",admin:false});
      }
  const admin=await Admin.find();
console.log(admin);
  const getAdmin=admin[0];
  console.log(getAdmin);
  if(!admin)
    {
      return res.render("admin-login", { error: "Invalid credentials" });
    }
    // Set admin session
    req.session.admin = admin.name;
    res.redirect("/api/v1/dashBoard");
  });
  router.get('/dashboard',(req,res)=>{
res.render('admin/dashboard')
  })

  module.exports=router;