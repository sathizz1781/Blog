const express = require("express");
const router  = express.Router();
const user     = require("../modules/user");
const user_obj = new user("user")

router.post("/login",(req,res)=>{
    user_obj.login(req.body,function(rslt){
		res.header('auth-token',rslt.result).json(rslt);
		
	})
})
module.exports = router;