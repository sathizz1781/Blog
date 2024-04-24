class common {
    constructor(){
        this.fs = require("fs")
    }
    remove_spaces(request){
        if(request){
            Object.keys(request).map((field)=>{
                // if((typeof(request[field]) === "string") && (!request[field].file)){
                if((typeof(request[field]) === "string")){
                    var input_field = request[field];
                    input_field     = input_field.toString();
                    input_field     = input_field.replace(/\s+/g, ' ').trim();
                    request[field] = input_field
                }
            })
        }
        return request;
    }

    // async file_upload(path,base64String,callback){
    //     try{
    //         let chk_path = path.split("/");
    //         chk_path.pop();
    //         chk_path = chk_path.join("/");
    //         const promise = new Promise((resolve,reject)=>{
    //             if(!this.fs.existsSync(chk_path)){
    //                 this.fs.mkdir(chk_path,{recursive:true}, (err) => {
    //                     if(err){
    //                         resolve({sts:false});
    //                     }else{
    //                         resolve({sts:true});
    //                     }
    //                 });
    //             }else{
    //                 resolve({sts:true});
    //             }
    //         });
    //         await promise.then(async(sts)=>{
    //             if(!sts){
    //                 return callback({status:false,message:"Unable to upload file",result:{},error:{}});
    //             }else{
    //                 await this.fs.writeFile(path, base64String,{encoding:'base64'},function(err){
    //                     if(err){
    //                         return callback({status:false,message:"Unable to upload file",result:{},error:{}});
    //                     }else{
    //                         return callback({status:true,message:"File Uploaded",result:{},error:{}});
    //                     }
    //                 });
    //             }
    //         });
    //     }catch(e){
    //         return callback({sts:false,msg:"Unable to upload file",rslt:[],error:[]});
    //     }
        
    // }

    async fileUpload(path,base64String){
        try{
            let chkPath = path.split("/");
            chkPath.pop();
            chkPath = chkPath.join("/");
            const promise = new Promise((resolve,reject)=>{
                if(!this.fs.existsSync(chkPath)){
                    this.fs.mkdir(chkPath,{recursive:true}, (err) => {
                        if(err){
                            resolve({sts:false});
                        }else{
                            resolve({sts:true});
                        }
                    });
                }else{
                    resolve({sts:true});
                }
            });
            await promise.then(async(sts)=>{
                if(!sts){
                    return false
                }else{
                    await this.fs.writeFile(path, base64String,{encoding:'base64'},function(err){
                        if(err){
                            return false
                        }else{
                            return true
                        }
                    });
                }
            });
        }catch(e){
            return false
        }
        
    }
}

module.exports = common