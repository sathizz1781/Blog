const express = require("express");
const router  = express.Router();
const user     = require("../modules/user");
const user_obj = new user("user")

router.post("/register",(req,res)=>{
	console.log(req);
    user_obj.register(req.body,function(rslt){
		res.json(rslt);
	})
})

module.exports = router;