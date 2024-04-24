const express  = require("express");
const router   = express.Router();
const post     = require("../modules/post");
const post_obj = new post("post")

router.post("/add",(req,res)=>{
    post_obj.add(req.body,function(rslt){
		res.json(rslt);
	})
})
router.post("/update",(req,res)=>{
    post_obj.update(req.body,function(rslt){
		res.json(rslt);
	})
})
router.post("/view",(req,res)=>{
    post_obj.view(req.body,function(rslt){
		res.json(rslt);
	})
})
router.post("/delete",(req,res)=>{
    post_obj.delete(req.body,function(rslt){
		res.json(rslt);
	})
})
 
module.exports = router;