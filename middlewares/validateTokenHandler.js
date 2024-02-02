const errorHandler=require("express-async-handler");
const jwt=require("jsonwebtoken");


const validateToken=errorHandler(async(req,res,next)=>{
    let token;
    let authHeader=req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {


        
        //---------- verify jwt token ---------------
        token=authHeader.split(" ")[1];
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET_KEY,(err,decoded)=>{
            if (err) {
                res.status(401).json({error_message:"unauthorized user"});
            }else{
                req.user = decoded.empExists;
                next(); 
            }
        //  ---------------------------------------------


            console.log("decoded: ",decoded);
        });
    }else {
        res.status(401).json({ error_message: "Unauthorized user" });
    }
});

module.exports=validateToken;