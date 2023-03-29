const router =require("express").Router();
const bcrypt =require("bcryptjs");
const User = require("../models/user");
const auth = require("../middleware/auth");


//UPDATE
router.put("/update/:id",auth,async(req,res)=>{
    const salt = bcrypt.genSaltSync(10);
    try{
       if(req.params.id===req.user.id||req.user.isAdmin){
        const user = await User.findById(req.params.id);
        const updatedUser= await User.findByIdAndUpdate(req.params.id,{$set:{
          username:req.body.username||user.username,
          email:req.body.email||user.email,
          isAdmin:req.body.isAdmin||user.isAdmin,
          profilePic:req.body.profilePic||user.profilePic,
          password:bcrypt.hashSync(req.body.password,salt)||user.password,
        }});
        res.status(202).json({user:updatedUser,
          msg:"user updated successfully"
        })
       }else{
         return res.status(404).json({msg:"you can update only your account"});
       }
    }catch(err){
        res.status(404).json({msg:err})
    }
})
//DELETE USER 
router.delete("/delete/:id",auth,async(req,res)=>{
    
    try{
       if(req.params.id===req.user.id||req.user.isAdmin){
         
        const user= await User.findByIdAndDelete(req.user.id)
        res.status(202).json({msg:"user deleted successfully"})
       }else{
         return res.status(404).json({msg:"you can delete only your account"});
       }
    }catch(err){
        res.status(404).json({msg:err})
    }
})
//GET USER BY ID
router.get("/getuser/:id",auth,async(req,res)=>{
    
    try{
       
        const user= await User.findById(req.params.id)
        res.status(202).json({user})
       
    }catch(err){
        res.status(404).json({msg:err})
    }
})
//GET USER 
router.get("/user",auth,async(req,res)=>{
    
    try{
        const user= await User.findById(req.user.id)
        res.status(202).json({user})
    }catch(err){
        res.status(404).json({msg:err})
    }
})
//GET ALL USERS
router.get("/getusers",auth,async(req,res)=>{
    const query=req.query.newUsers;
    try{
      if(req.user.isAdmin){
        const user= query?await User.find().limit(10):await User.find();
        res.status(202).json({user})
      }else{
        res.status(404).json({msg:"you are not allowed to see all users"})
      }
    }catch(err){
        res.status(404).json({msg:err})
    }
})
//USER STATS
router.get("/userstats",auth,async(req,res)=>{
   const today=new Date();
   const lastYear=today.setFullYear(today.setFullYear - 1);
   const returnedarray=[]
    const months=[
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
      ]
    try{
        const data = await User.aggregate([
          {
            $project:{
              month:{$month:"$createdAt"}
            }
          },
          {
            $group:{
              _id:"$month",
              total:{$sum:1}
            }
          }
          ])
          data.map(item=>{
            returnedarray.push({month:months[item._id-1],total:item.total})
          })
        
        res.status(202).json(returnedarray)
    }catch(err){
        res.status(404).json({msg:err})
    }
})




module.exports=router;