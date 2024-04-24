class comment {
    #module_name = null;
    #is_valid    = false;
    #module      = null;
    #scheme_info = null;
    #error_msg   = {status:false,message:"Invaid module request",result:{},error:{}};
    constructor(module_name){
        if(module_name){
            try{
                this.#module_name = module_name;
                this.#module      = require("../schemes/"+this.#module_name)
                this.validate     = require("../validations/"+this.#module_name);
                this.mongoose     = require("mongoose");
                this.#scheme_info = this.mongoose.model(this.#module_name);
                this.#is_valid   = true
            } catch(e){
                this.#is_valid   = false
            }
        }else{
            this.#is_valid = false
        }
    }

    async add(request,callback){ 
        if(!this.#is_valid){
            return callback(this.#error_msg);
        }else{
            this.validate.add(request,async function(validation_rslt){
                if(!validation_rslt.status){
                    return callback(validation_rslt);
                }else{
                    let {comment,postId,doneBy} = request
                    let findQuery = {_id:doneBy}
                    let project   = {password:0}
                    let user = this.mongoose.model("user");
                    await user.findOne(findQuery,project).then(async(usrnm_res)=>{
                        console.log(usrnm_res);
                        if(!usrnm_res){
                            return callback({statusCode:404,status:false,message:"User not found",result:{},error:{}})
                        }else{
                            findQuery._id = postId
                            project = {}
                            let post = this.mongoose.model("post");
                            await post.findOne(findQuery,project).then(async(post_res)=>{
                                if(!post_res){
                                    return callback({statusCode:404,status:false,message:"Post not found",result:{},error:{}})
                                }else{
                                    let insertInfo = {...request}
                                    insertInfo.createdBy = request.doneBy
                                    await this.#scheme_info.create(insertInfo).then(response=>{
                                        response.commenter =  usrnm_res.firstName+" "+usrnm_res.lastName
                                        return callback({statusCode:200,status:true,message:"Inserted Successfully !!!",result:response,error:{}})
                                    }).catch(error=>{
                                        return callback({statusCode:500,status:false,message:"Please check your query & retry", result:{},error:{}});
                                    })
                                }
                            }).catch(error=>{
                                console.log(error);
                                return callback({statusCode:500,status:false,message:"Please check your query & retry", result:{},error:{}});
                            })
                        }
                    }).catch(error=>{
                        console.log(error);
                        return callback({statusCode:500,status:false,message:"Please check your query & retry", result:{},error:{}});
                    })
                }
                
            }.bind(this))
        }
    }

    async view(request,callback){ 
        if(!this.#is_valid){
            return callback(this.#error_msg);
        }else{
            this.validate.view(request,async function(validation_rslt){
                if(!validation_rslt.status){
                    return callback(validation_rslt);
                }else{
                    const aggregateQuery = [
                        {$match:{postId:new this.mongoose.Types.ObjectId(request.postId)}},
                        {$sort:{_id:-1}},
                        {$lookup:{
                            from:"users",
                            let :{id: "$createdBy"},
                            pipeline: [
                                {$match: {$expr:{$eq: ["$_id","$$id"]}}},
                                {$project:{commenter:{$concat:["$firstName"," ","$lastName"]}}}
                            ],
                            as:"userResult"
                        }},
                        {$unwind:{path:"$userResult",preserveNullAndEmptyArrays: true}},
                        {$project:{
                            comment:"$comment",
                            commenter: "$userResult.commenter",
                            createdBy:"$createdBy"
                        }}
                    ];
                    await this.#scheme_info.aggregate(aggregateQuery).then(async(response)=>{
                        if(!response){
                            return callback({statusCode:404,status:false,message:"No record found",result:{},error:{}})
                        }else{
                            return callback({statusCode:200,status:true,message:"Post found !!!",result:response,error:{}})
                        }
                    }).catch(error=>{
                        console.log(error);
                        return callback({statusCode:500,status:false,message:"Please check your query & retry", result:{},error:{}});
                    })
                }
            }.bind(this))
        }
    }

    async edit(request,callback){ 
        if(!this.#is_valid){
            return callback(this.#error_msg);
        }else{
            this.validate.edit(request,async function(validation_rslt){
                if(!validation_rslt.status){
                    return callback(validation_rslt);
                }else{
                    let findQuery = {_id:request.commentId}
                    let project   = {}
                    
                    await this.#scheme_info.findOne(findQuery,project).then(async(comm_res)=>{
                        if(!comm_res){
                            return callback({statusCode:404,status:false,message:"No comment found to update",result:{},error:{}})
                        }else{
                            if(comm_res.createdBy.toString() === request.doneBy){
                                let updateInfo = {...request}
                                updateInfo.comment = (updateInfo.comment === "") ? comm_res.comment : updateInfo.comment;
                                updateInfo.updatedDate = Date.now();
                                
                                await this.#scheme_info.findOneAndUpdate(
                                    findQuery,
                                    {"$set":updateInfo},
                                    {projection:project,new: true}
                                ).then(response=>{
                                    if(!response){
                                        return callback({statusCode:404,status:false,message:"No record found to update",result:{},error:{}})
                                    }else{
                                        return callback({statusCode:200,status:true,message:"Updated Successfully !!!",result:response,error:{}})
                                    }
                                }).catch(error=>{
                                    return callback({statusCode:500,status:false,message:"Please check your query & retry", result:{},error:{}});
                                })
                            }else{
                                return callback({statusCode:200,status:true,message:"Invalid user !!!",result:{},error:{}})
                            }
                        }
                    }).catch(error=>{
                        console.log(error);
                        return callback({statusCode:500,status:false,message:"Please check your query & retry", result:{},error:{}});
                    })
                }
                
            }.bind(this))
        }
    }

    async delete(request,callback){ 
        if(!this.#is_valid){
            return callback(this.#error_msg);
        }else{
            this.validate.delete(request,async function(validation_rslt){
                if(!validation_rslt.status){
                    return callback(validation_rslt);
                }else{
                    let findQuery = {_id:request.commentId}
                    await this.#scheme_info.findOne(findQuery,project).then(async(comm_res)=>{
                        if(!comm_res){
                            return callback({statusCode:404,status:false,message:"No comment found to delete",result:{},error:{}})
                        }else{
                            if(comm_res.createdBy.toString() === request.doneBy){
                                await this.#scheme_info.deleteOne(findQuery).then(response=>{
                                    return callback({statusCode:200,status:true,message:"Deleted Successfully !!!",result:response,error:{}})
                                }).catch(error=>{
                                    return callback({statusCode:500,status:false,message:"Please check your query & retry", result:{},error:{}});
                                })
                            }else{
                                return callback({statusCode:200,status:true,message:"Invalid user !!!",result:{},error:{}})
                            }
                        }
                    }).catch(error=>{
                        console.log(error);
                        return callback({statusCode:500,status:false,message:"Please check your query & retry", result:{},error:{}});
                    })
                }
            }.bind(this))
        }
    }
}

module.exports = comment