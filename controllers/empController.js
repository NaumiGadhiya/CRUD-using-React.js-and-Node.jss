const empModel=require("../models/empModel");
const errorHandler=require("express-async-handler");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");



//-------------- congigure all employee apis ---------------------------





//-------- login user api ----------
const loginUser=errorHandler(async(req,res)=>{
    const {email,password}=req.body;
    const userExists=await empModel.findOne({email});
    if (!email || !password) {
        res.status(400).json({error_message:"All fields are required !"});
    }
    else if(userExists && (await bcrypt.compare(password,userExists.password))){
        
        //---------- create jwt token ----------
        const jwtToken=jwt.sign({
            userExists:{
                name:userExists.name,
                email:userExists.email,
                age:userExists.age,
                id:userExists.id,
            },
        },
            process.env.ACCESS_TOKEN_SECRET_KEY,
            {expiresIn: "15m"},
        )
        //  ---------------------------------------------
        
        res.status(200).json({_id:userExists.id,email:userExists.email,jwt_token:jwtToken});
    }else{
        res.status(400).json({message:"invalid credential"});
    }
});




//---------- add employee api ----------
const createEmp=errorHandler(async(req,res,next)=>{
    try {
        const {name,email,age,password}=req.body;
        const empExists=await empModel.findOne({email});
        const bcryptPassword=await bcrypt.hash(password,10);

        //---------- validate employee data ----------
        if(!name || !email || !age || !password){
            res.status(400).json({error_message:"All fields are required !"});
        }
        else if (empExists) {
            res.status(400).json({error_message:"Employee is already exist !"});
        }
        else if (!name.match("^[a-zA-Z\\s]+$")) {
            res.status(400).json({error_message:"It contains only alphabets !"});
        }
        else if (!email.match("^[a-z0-9+_.-]+@(.)+[a-z]$")) {
            res.status(400).json({error_message:"Invalid email format !"});
        }
        else if (age<18 || age>60) {
            res.status(400).json({error_message:"Age must be under 18-60 !"});
        }
        else{
            //---------- add employee data ----------
            const createdEmp=await empModel.create({
                name,
                email,
                age,
                password:bcryptPassword,
            },);
            if (createdEmp) {
                res.status(200).json({_id:createdEmp.id,email:createdEmp.email});
            }else{
                res.status(400).json({message:"user data are invalid"});
            }
        }
    } catch (error) {
        next(error);
    }
    
});




//-------- get employees ----------
const getAllEmps=errorHandler(async(req,res,next)=>{
    try {
        const allEmps=await empModel.find();
        if (allEmps.length>0) {
            res.send(allEmps);
        }
        else{
            res.status(400).json({error_message:"No one found"});
        }
    } catch (error) {
        next(error);
    }
});

const getEmpById=errorHandler(async(req,res,next)=>{
    try {
        const emp=await empModel.findById(req.params.id);
        if (!emp) {
            res.status(400).json({error_message:"employee not found"});
        }
        else{
            res.send(emp);
        }
    } catch (error) {
        next(error);
    }
});



//-------- update employee api ----------
const updateEmp=errorHandler(async(req,res,next)=>{
    try {
        const {name,email,age,password}=req.body; 
       
        const empExists=await empModel.findOne({_id:req.params.id});
        console.log("empExists: ",empExists);

        if (password) {
            const bcryptPassword=await bcrypt.hash(password,10);
            req.body.password=bcryptPassword;
        }
        if(!name || !email || !age || !password){
            res.status(400).json({error_message:"All fields are required"});
        }
        else if (!empExists) {
            res.status(400).json({error_message:"employee not found"});
        }
        else if (!name.match("^[a-zA-Z\\s]+$")) {
            res.status(400).json({error_message:"It contains only alphabets !"});
        }
        else if (!email.match("^[a-z0-9+_.-]+@(.)+[a-z]$")) {
            res.status(400).json({error_message:"Invalid email format !"});
        }
        else if (age<18 || age>60) {
            res.status(400).json({error_message:"Age must be under 18-60 !"});
        }
        else{
            const updatedEmp=await empModel.findByIdAndUpdate(
                req.params.id,
                req.body,
                {new:true},
            );
            res.send(updatedEmp);
        }
    } catch (error) {
        next(error);
    }
});




//-------- delete employee api ----------
const deleteEmp=errorHandler(async(req,res,next)=>{
    try {
        const deltedEmp=await empModel.findOneAndDelete({_id:req.params.id});
        if (!deltedEmp) {
            res.status(400).json({error_message:"employee not found"});
        }else{
            res.status(200).json({success_message:"employee deleted"});
        }
    } catch (error) {
        next(error);
    }
});
//  ----------------------------------------------------------------------- 


module.exports={loginUser,createEmp,getAllEmps,getEmpById,updateEmp,deleteEmp};