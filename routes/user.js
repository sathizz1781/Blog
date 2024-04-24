const express = require("express");
const router  = express.Router();
const user     = require("../modules/user");
const user_obj = new user("user")

router.post("/update",(req,res)=>{
    user_obj.update(req.body,function(rslt){
		res.json(rslt);
	})
})
router.post("/view",(req,res)=>{
    user_obj.view(req.body,function(rslt){
		res.json(rslt);
	})
})
router.post("/delete",(req,res)=>{
    user_obj.delete(req.body,function(rslt){
		res.json(rslt);
	})
})
 
module.exports = router;