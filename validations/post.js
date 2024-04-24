const validator         = require("validator");
const isEmpty           = require("is-empty");
const common_validation = require("./common")
const common            = require("../modules/common")
const common_obj        = new common()

exports.add = async function add(request,callback){
    let errors = {};
    let inputFields = common_obj.remove_spaces(request)
    let {headline,image,doneBy} = inputFields

    //IMAGE FILE
    if(image &&image.file.trim() !== ""){
        let img_rslt =  common_validation.imageValidation(image)
        errors = {...errors,...img_rslt}
    }
    //HEADLINE
    headline = !isEmpty(headline) ? headline : "";
    if(validator.isEmpty(headline)){
        errors.headline = "Please provide headline";
    }
    //CREATED BY
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    doneBy = !isEmpty(doneBy) ? doneBy : "";
    if(validator.isEmpty(doneBy)){
        errors.doneBy = "Please provide created by";
    }else
    if(!objectIdPattern.test(doneBy)){
        errors.doneBy = "Please provide valid created by ID";
    }
    
    if(isEmpty(errors)){
        return callback({"statusCode":200, status:true,message:"Validated successfully !!!",result:{},error:{}})
    }else{
        return callback({"statusCode":403, status:false,message:"Validation fail",result:{},error:errors})
    }
}

exports.update = async function update(request,callback){
    let errors = {};
    let inputFields = common_obj.remove_spaces(request)

    let {postId,doneBy,image} = inputFields 

    //IMAGE FILE
    if(image &&image.file.trim() !== ""){
        let img_rslt =  common_validation.imageValidation(image)
        errors = {...errors,...img_rslt}
    }

    //UPDATED BY
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    doneBy = !isEmpty(doneBy) ? doneBy : "";
    if(validator.isEmpty(doneBy)){
        errors.doneBy = "Please provide updated by";
    }else
    if(!objectIdPattern.test(doneBy)){
        errors.doneBy = "Please provide valid updated by ID";
    }

    //POST ID
    postId = !isEmpty(postId) ? postId : "";
    if(validator.isEmpty(postId)){
        errors.postId = "Please provide post ID";
    }else
    if(!objectIdPattern.test(postId)){
        errors.postId = "Please provide valid post ID";
    }

    if(isEmpty(errors)){
        return callback({"statusCode":200, status:true,message:"Validated successfully !!!",result:{},error:{}})
    }else{
        return callback({"statusCode":403, status:false,message:"Validation fail",result:{},error:errors})
    }
}

exports.delete = async function delet(request,callback){
    let errors = {};
    let inputFields = common_obj.remove_spaces(request);
    let {postId,doneBy} = inputFields 
    //DELETED BY
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    doneBy = !isEmpty(doneBy) ? doneBy : "";
    if(validator.isEmpty(doneBy)){
        errors.doneBy = "Please provide updated by";
    }else
    if(!objectIdPattern.test(doneBy)){
        errors.doneBy = "Please provide valid updated by ID";
    }

    //POST ID
    postId = !isEmpty(postId) ? postId : "";
    if(validator.isEmpty(postId)){
        errors.postId = "Please provide post ID";
    }else
    if(!objectIdPattern.test(postId)){
        errors.postId = "Please provide valid post ID";
    }
    
    if(isEmpty(errors)){
        return callback({"statusCode":200, status:true,message:"Validated successfully !!!",result:{},error:{}})
    }else{
        return callback({"statusCode":403, status:false,message:"Validation fail",result:{},error:errors})
    }
}