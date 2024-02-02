const mongoose=require("mongoose");


//------- create employee model/schema -------------
const empSchema=mongoose.Schema({
        name:{
            type:String,
            required:[true,"name field is required"],
        },
        email:{
            type:String,
            required:[true,"email field is required"],
            unique: [true,"email must be unique"],
        },
        age:{
            type:Number,
            required:[true,"age field is required"],
        },
        password:{
            type:String,
            required:[true,"password field is required"],
        },
    },
    {
        timestamps:true,
    },
);

module.exports=mongoose.model("Emps",empSchema);