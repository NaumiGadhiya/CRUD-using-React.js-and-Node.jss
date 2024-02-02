const express=require("express");
const connectMongodb=require("./config/dbConnection");
const dotenv=require("dotenv").config();
const cors=require("cors");

const app=express();
connectMongodb();

const port=process.env.PORT || 5001;

app.use(cors());
app.use(express.json());


//-------------- cofigure base api ---------------------
app.use("/emp",require("./routes/empRoute"));



//-------------- cofigure port number on server ---------------------
app.listen(port,()=>{
    console.log(`server running on ${port}`)
});