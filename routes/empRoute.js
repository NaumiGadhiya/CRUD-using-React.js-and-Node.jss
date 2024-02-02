const express=require("express");
const router=express.Router();
const {loginUser,createEmp,getAllEmps,getEmpById,updateEmp,deleteEmp}=require("../controllers/empController");
const validateToken=require("../middleware/validateTokenHandler");


//-------------- cofigure all api routes ---------------------------
router.post("/auth",loginUser);
router.route("/").get(getAllEmps).post(createEmp);
router.route("/:id").get(getEmpById).put(validateToken,updateEmp).delete(validateToken,deleteEmp);
// ----------------------------------------------------------------------- 


module.exports=router;