const jwt=require("jsonwebtoken");

function Auth(req,res,next){
  const token = req.header("x-auth-token");
  if(token){
    const decoded=jwt.verify(token,process.env.SECRETCODE);
    !decoded&&res.status(403).json({msg:"invalid token"});
    req.user=decoded;
    next();
  }else{
    return res.status(403).json({msg:"not authantecated"})
  }
}
module.exports=Auth;