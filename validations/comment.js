const validator         = require("validator");
const isEmpty           = require("is-empty");
const common            = require("../modules/common")
const common_obj        = new common()

exports.add = async function add(request,callback){
    let errors = {};
    let inputFields = common_obj.remove_spaces(request)

    let {postId,createdBy,comment} = inputFields 

    //COMMENT
    comment = !isEmpty(comment) ? comment : "";
    if(validator.isEmpty(comment)){
        errors.comment = "Please provide comment";
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

exports.edit = async function edit(request,callback){
    let errors = {};
    let inputFields = common_obj.remove_spaces(request)

    let {commentId,doneBy,comment} = inputFields 

    //COMMENT
    comment = !isEmpty(comment) ? comment : "";
    if(validator.isEmpty(comment)){
        errors.comment = "Please provide comment";
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

    //COMMENT ID
    commentId = !isEmpty(commentId) ? commentId : "";
    if(validator.isEmpty(commentId)){
        errors.commentId = "Please provide comment ID";
    }else
    if(!objectIdPattern.test(commentId)){
        errors.commentId = "Please provide valid comment ID";
    }

    if(isEmpty(errors)){
        return callback({"statusCode":200, status:true,message:"Validated successfully !!!",result:{},error:{}})
    }else{
        return callback({"statusCode":403, status:false,message:"Validation fail",result:{},error:errors})
    }
}

exports.view = async function view(request,callback){
    let errors = {};
    let inputFields = common_obj.remove_spaces(request);
    let {postId} = inputFields 

    //POST ID
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
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
    let {commentId,doneBy} = inputFields 

    //COMMENT ID
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    commentId = !isEmpty(commentId) ? commentId : "";
    if(validator.isEmpty(commentId)){
        errors.commentId = "Please provide comment ID";
    }else
    if(!objectIdPattern.test(commentId)){
        errors.commentId = "Please provide valid comment ID";
    }

    //DELETED BY
    doneBy = !isEmpty(doneBy) ? doneBy : "";
    if(validator.isEmpty(doneBy)){
        errors.doneBy = "Please provide updated by";
    }else
    if(!objectIdPattern.test(doneBy)){
        errors.doneBy = "Please provide valid updated by ID";
    }
    
    if(isEmpty(errors)){
        return callback({"statusCode":200, status:true,message:"Validated successfully !!!",result:{},error:{}})
    }else{
        return callback({"statusCode":403, status:false,message:"Validation fail",result:{},error:errors})
    }
}