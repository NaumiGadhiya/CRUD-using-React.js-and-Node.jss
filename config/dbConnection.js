const mongoose=require("mongoose");

const connectMongodb=async()=>{
    try {

        
  //-------------- connect with mongodb database ---------------------------
        const connect=await mongoose.connect(
            process.env.CONNECTION_STRING
        );
        console.log(
            "connected to the db:",
            connect.connection.name
        );
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
    //  ----------------------------------------------------------------------- 
};

module.exports=connectMongodb;

