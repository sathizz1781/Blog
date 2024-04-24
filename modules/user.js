class user {
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
                this.bcrypt       = require("bcrypt");
                this.mongoose     = require("mongoose");
                this.#scheme_info = this.mongoose.model(this.#module_name);
                this.date_to_age  = require("dob-to-age");
                this.jwt          = require("jsonwebtoken");
                this.#is_valid   = true
            }catch(e){
                this.#is_valid   = false
            }
        }else{
            this.#is_valid = false
        }
    }

    async login(request,callback){ 
        if(!this.#is_valid){
            return callback(this.#error_msg);
        }else{
            this.validate.login(request,async function(validation_rslt){
                if(!validation_rslt.status){
                    return callback(validation_rslt);
                }else{
                    let {userName,password} = request
                    let findQuery = {userName:userName}
                    let project   = {}
                    
                    await this.#scheme_info.findOne(findQuery,project).then(async(usrnm_res)=>{
                        if(!usrnm_res){
                            return callback({statusCode:404,status:false,message:"Invalid user name",result:{},error:{}})
                        }else{
                            this.bcrypt.compare(password, usrnm_res.password).then(async(isMatch)=>{
                                if(!isMatch) {
                                    return callback({statusCode:404,status:false,message:"Password incorrect",result:{},error:{}});
                                }else{
                                    const payLoad = {
                                        _id:usrnm_res._id,
                                        email:usrnm_res.email,
                                        userName:usrnm_res.userName
                                    }
                                    const token = this.jwt.sign(payLoad,'sk@33',{expiresIn:'1d'});
                                    let updateInfo = {
                                        lastLogin:Date.now(),
                                        token:token
                                    }
                                    project = {password:0}
                                    await this.#scheme_info.findOneAndUpdate(
                                        findQuery,
                                        {"$set":updateInfo},
                                        {projection:project,new: true}
                                    ).then(response=>{
                                        return callback({statusCode:200,status:true,message:"Login Successfully !!!",result:token,error:{}})
                                    }).catch(error=>{
                                        return callback({statusCode:500,status:false,message:"Please check your query & retry", result:{},error:{}});
                                    })
                                }
                            });
                        }
                    }).catch(error=>{
                        console.log(error);
                        return callback({statusCode:500,status:false,message:"Please check your query & retry", result:{},error:{}});
                    })
                }
            }.bind(this))
        }
    }

    async register(request,callback){ 
        if(!this.#is_valid){
            return callback(this.#error_msg);
        }else{
            this.validate.register(request,async function(validation_rslt){
                if(!validation_rslt.status){
                    return callback(validation_rslt);
                }else{
                    let {firstName,lastName,userName,password,confirmPassword,email,dob,gender,bio,avatar} = request
                    let findQuery = {userName:userName}
                    let project   = {password:0}
                    await this.#scheme_info.findOne(findQuery,project).then(async(usrnm_res)=>{
                        if(usrnm_res){
                            return callback({statusCode:409,status:false,message:"Username found try using new",result:{},error:{}})
                        }else{
                            delete findQuery.userName
                            findQuery.email = email
                            await this.#scheme_info.findOne(findQuery,project).then(async(email_res)=>{
                                if(email_res){
                                    return callback({statusCode:409,status:false,message:"Email found try with other email",result:{},error:{}})
                                }else{
                                    let insertInfo = {
                                        firstName:firstName,
                                        lastName:lastName,
                                        userName:userName,
                                        password:await this.bcrypt.hash(password,10),
                                        email:email,
                                        dob:dob,
                                        age:this.date_to_age(dob),
                                        gender:gender,
                                        bio:bio
                                    }
                                    if(avatar && avatar.file !== ""){
                                        let fileName = userName.toLowerCase();
                                        let fileExt  = avatar.type.toLowerCase();
                                        let filePath = './uploads/user/profile_'+fileName+'.'+fileExt.toLowerCase();
                                        let imageUpload = this.#common_obj.fileUpload(filePath,avatar.file)
                                        if(imageUpload){
                                            insertInfo.avatar = filePath
                                        }
                                    }
                                    await this.#scheme_info.create(insertInfo).then(response=>{
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
                    let {email} = request
                    let findQuery = {email:email}
                    let project   = {password:0}
                    await this.#scheme_info.findOne(findQuery,project).then(async(response)=>{
                        if(!response){
                            return callback({statusCode:404,status:false,message:"No record found",result:{},error:{}})
                        }else{
                            return callback({statusCode:200,status:true,message:"Record found !!!",result:response,error:{}})
                        }
                    }).catch(error=>{
                        console.log(error);
                        return callback({statusCode:500,status:false,message:"Please check your query & retry", result:{},error:{}});
                    })
                }
                
            }.bind(this))
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
                    let findQuery = {userName:request.userName}
                    let project   = {password:0}
                    
                    await this.#scheme_info.findOne(findQuery,project).then(async(usrnm_res)=>{
                        if(!usrnm_res){
                            return callback({statusCode:404,status:false,message:"No record found to update",result:{},error:{}})
                        }else{
                            let updateInfo = {...request}
                            updateInfo.firstName = (updateInfo.firstName === "") ? usrnm_res.firstName : updateInfo.firstName;
                            updateInfo.lastName = (updateInfo.lastName === "") ? usrnm_res.lastName : updateInfo.lastName;
                            updateInfo.gender = (updateInfo.gender === "") ? usrnm_res.gender : updateInfo.gender;
                            updateInfo.dob = (updateInfo.dob === "") ? usrnm_res.dob : updateInfo.dob;
                            updateInfo.email = usrnm_res.email
                            updateInfo.updatedDate = Date.now()
                            delete updateInfo.userName
                            delete updateInfo.email
                            if(updateInfo.age){
                                updateInfo.age = this.date_to_age(request.dob)
                            }
                            if(updateInfo.avatar && updateInfo.avatar.file !== ""){
                                let fileName = usrnm_res.userName.toLowerCase();
                                let fileExt  = updateInfo.avatar.type.toLowerCase();
                                let filePath = './uploads/user/profile_'+fileName+'.'+fileExt.toLowerCase();
                                let imageUpload = this.#common_obj.fileUpload(filePath,updateInfo.avatar.file)
                                if(imageUpload){
                                    updateInfo.avatar = filePath
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
                    let findQuery = {email:request.email,_id:request.doneBy}
                    await this.#scheme_info.deleteOne(findQuery).then(response=>{
                        if(parseInt(response.deletedCount) > 0){
                            return callback({statusCode:200,status:true,message:"Deleted Successfully !!!",result:`Deleted record - ${response.deletedCount}`,error:{}})
                        }else{
                            return callback({statusCode:200,status:true,message:"No record to delete !!!",result:{},error:{}})
                        }
                        
                    }).catch(error=>{
                        return callback({statusCode:500,status:false,message:"Please check your query & retry", result:{},error:{}});
                    })
                }
            }.bind(this))
        }
    }
}

module.exports = user;