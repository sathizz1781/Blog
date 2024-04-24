const express     = require("express");
const router      = express.Router();
const comment     = require("../modules/comment");
const comment_obj = new comment("comment")

router.post("/add",(req,res)=>{
    comment_obj.add(req.body,function(rslt){
		res.json(rslt);
	})
})
router.post("/edit",(req,res)=>{
    comment_obj.edit(req.body,function(rslt){
		res.json(rslt);
	})
})
router.post("/view",(req,res)=>{
    comment_obj.view(req.body,function(rslt){
		res.json(rslt);
	})
})
router.post("/delete",(req,res)=>{
    comment_obj.delete(req.body,function(rslt){
		res.json(rslt);
	})
})
 
module.exports = router;