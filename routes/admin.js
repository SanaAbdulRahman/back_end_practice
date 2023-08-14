const {Admin}=require('../models/admin');
const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');


router.get('/adminLogin',(req,res)=>{
    if (req.session.admin) {
        return res.render('admin/dashboard',{layout:'./layouts/admin-layout'}); // Redirect to your home page
    }
    else{
    return res.render('admin-login',{layout:'./layouts/admin-layout'});
    }
})


// router.post("/adminLogin",async(req,res)=>{
//     const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     const admin = new Admin({
//         name: req.body.name,
//         passwordHash: hashedPassword,
//         });
//         const adminUser=await admin.save();

//         if(adminUser){
//             console.log("Successfully created admin");
//         }
// })
router.post("/adminLogin",async (req, res) => {
    //const { username, password } = req.body;
    const name=req.body.name;
    const password=req.body.password;
    if(!name || !password){
        return res.render("admin-login",{error:"Please enter username or password",layout:'./layouts/admin-layout'});
      }
      try{
  const admin=await Admin.findOne({name});

  if(!admin || !bcrypt.compareSync(password, admin.passwordHash) )
    {
      return res.render("admin-login", { error: "Invalid credentials" ,layout:'./layouts/admin-layout'});
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
        res.render('admin/dashboard',{admin,layout:'./layouts/admin-layout'})
    
  })
  router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Error while logging out');
        }
        res.redirect('/api/v1/adminLogin'); // Redirect to your home page after logout
    });
});

  module.exports=router;