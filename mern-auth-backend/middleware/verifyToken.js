const jwt=require('jsonwebtoken')
const secretKey='secrettoken'

function verifyToken(req,res,next){
    const token=req.headers["authorization"]
    if(!token){
        res.status(400).json({msg:"Token not send along"})
    }
    // console.log(token)

    try{
        const decoded = jwt.verify(token, secretKey);
		req.user = decoded.user;
		next();
    }catch(err){
        res.status(401).json({ msg: "Token is not valid" });
    }
}
module.exports=verifyToken;