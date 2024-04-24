class post {
    #module_name = null;
    #is_valid    = false;
    #module      = null;
    #common_obj  = null;
    #scheme_info = null;
    #error_msg   = {status:false,message:"Invaid module request",result:{},error:{}};
    constructor(module_name){
        if(module_name){
            try{
                this.#module_name = module_name;
                this.#module      = require("../schemes/"+this.#module_name)
                this.validate     = require("../validations/"+this.#module_name);
                this.common       = require("./common")
                this.#common_obj  = new this.common()
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
                    let {headline,paragraph,image,doneBy} = request
                    let findQuery = {_id:doneBy}
                    let project   = {}
                    let user = this.mongoose.model("user");
                    await user.findOne(findQuery,project).then(async(usrnm_res)=>{
                        console.log(usrnm_res);
                        if(!usrnm_res){
                            return callback({statusCode:404,status:false,message:"User not found",result:{},error:{}})
                        }else{
                            let insertInfo = {...request}
                            insertInfo.createdBy = request.doneBy
                            let currentDate = `${new Date().toISOString().slice(0, 19).replace('T', ':').replace(/[-]/g, ':')}`
                            insertInfo.postName = usrnm_res.userName+"_"+currentDate
                            if(image && image.file !== ""){
                                let fileName = insertInfo.postName;
                                let fileExt  = image.type.toLowerCase();
                                let filePath = './uploads/post/post_'+fileName+'.'+fileExt.toLowerCase();
                                let imageUpload = this.#common_obj.fileUpload(filePath,image.file)
                                if(imageUpload){
                                    insertInfo.image = filePath
                                }
                            }
                            await this.#scheme_info.create(insertInfo).then(response=>{
                                response.blogger =  usrnm_res.firstName+" "+usrnm_res.lastName
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
                
            }.bind(this))
        }
    }

    async view(request,callback){ 
        if(!this.#is_valid){
            return callback(this.#error_msg);
        }else{ 
            let sort  = request.sort ? parseInt(request.sort) : -1;
            let limit = request.limit ? parseInt(request.limit) : 10;
            let page  = request.page ? parseInt(request.page) : 1;
            const aggregateQuery = [
                {$match:{_id:{$ne:null}}},
                {$sort:{_id:sort}},
                {$skip:(page - 1) * limit},
                {$limit:limit},
                {$lookup:{
                    from:"users",
                    let :{id: "$createdBy"},
                    pipeline: [
                        {$match: {$expr:{$eq: ["$_id","$$id"]}}},
                        {$project:{blogger:{$concat:["$firstName"," ","$lastName"]}}}
                    ],
                    as:"userResult"
                }},
                {$unwind:{path:"$userResult",preserveNullAndEmptyArrays: true}},
                {$project:{
                    headline:"$headline",
                    paragraph:"$paragraph",
                    image:"$image",
                    blogger: "$userResult.blogger",
                    like:"$like",
                    createdBy:"$createdBy"
                }}
            ];
            await this.#scheme_info.aggregate(aggregateQuery).then(async(response)=>{
                if(!response){
                    return callback({statusCode:404,status:false,message:"No record found",result:{},error:{}})
                }else{
                    let totalCount = await this.#scheme_info.countDocuments({})
                    let output = {
                        "posts":response,
                        "currentPage":page,
                        "totalPage":Math.ceil(totalCount/limit)
                    }
                    return callback({statusCode:200,status:true,message:"Post found !!!",result:output,error:{}})
                }
            }).catch(error=>{
                console.log(error);
                return callback({statusCode:500,status:false,message:"Please check your query & retry", result:{},error:{}});
            })
        }
    }

    async update(request,callback){ 
        if(!this.#is_valid){
            return callback(this.#error_msg);
        }else{
            this.validate.update(request,async function(validation_rslt){
                if(!validation_rslt.status){
                    return callback(validation_rslt);
                }else{
                    let findQuery = {_id:request.postId}
                    let project   = {}
                    
                    await this.#scheme_info.findOne(findQuery,project).then(async(post_res)=>{
                        if(!post_res){
                            return callback({statusCode:404,status:false,message:"No post found to update",result:{},error:{}})
                        }else{
                            if(post_res.createdBy.toString() === request.updatedBy){
                                let updateInfo = {...request}
                                updateInfo.headline = (updateInfo.headline === "") ? post_res.headline : updateInfo.headline;
                                updateInfo.postName = post_res.postName
                                updateInfo.updatedDate = Date.now();
                                if(updateInfo.image && updateInfo.image.file !== ""){
                                    let fileName = post_res.postName;
                                    let fileExt  = updateInfo.image.type.toLowerCase();
                                    let filePath = './uploads/post/post_'+fileName+'.'+fileExt.toLowerCase();
                                    let imageUpload = this.#common_obj.fileUpload(filePath,request.image.file)
                                    if(imageUpload){
                                        updateInfo.image = filePath
                                    }
                                }
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
                    let findQuery = {_id:request.postId}
                    await this.#scheme_info.findOne(findQuery,project).then(async(post_res)=>{
                        if(!post_res){
                            return callback({statusCode:404,status:false,message:"No post found to delete",result:{},error:{}})
                        }else{
                            if(post_res.createdBy.toString() === request.deletedBy){
                                await this.#scheme_info.deleteOne(findQuery).then(async(response)=>{
                                    delete findQuery._id
                                    findQuery.postId = request.postId
                                    let comment = this.mongoose.model("comment");
                                    await comment.deleteMany(findQuery).then(comm_res=>{
                                        return callback({statusCode:200,status:true,message:"Deleted Successfully !!!",result:response,error:{}})
                                    }).catch(error=>{
                                        return callback({statusCode:500,status:false,message:"Please check your query & retry", result:{},error:{}});
                                    })
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

module.exports = post