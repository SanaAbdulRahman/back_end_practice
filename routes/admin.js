const {Admin}=require('../models/admin');
const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');


router.get('/adminLogin',(req,res)=>{
    if (req.session.admin) {
        return res.render('admin/dashboard'); // Redirect to your home page
    }
    else{
    return res.render('admin-login');
    }
})

router.post("/adminLogin",async (req, res) => {
    //const { username, password } = req.body;
    const name=req.body.name;
    const password=req.body.password;
    if(!name || !password){
        return res.render("admin-login",{error:"Please enter username or password",admin:false});
      }
      try{
  const admin=await Admin.findOne({name});

  if(!admin )
    {
      return res.render("admin-login", { error: "Invalid credentials" });
    }
    // Set admin session
    req.session.admin = admin.name;
    res.redirect("/api/v1/dashBoard");
}
catch(error){
    console.error("Error fetching admin:", error);
    return res.render("admin-login", { error: "An error occurred while fetching admin." });
}
console.log("Searching for admin with name:", name);
const admin = await Admin.findOne({ name: name });
console.log("Found admin:", admin);
  });


router.get('/dashboard',(req,res)=>{
    const admin=req.session.admin;
    console.log(admin);
    if (!admin) {
        return res.render('admin-login'); // Redirect to your login page
    }
        res.render('admin/dashboard',{admin})
    
  })

  module.exports=router;