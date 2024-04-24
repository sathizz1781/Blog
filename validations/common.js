const validator  = require("validator");
const isEmpty    = require("is-empty");
const common     = require("../modules/common");
const common_obj = new common();

exports.imageValidation = function imageValidation(image){
    let errors  = {};
    let inputFields = common_obj.remove_spaces(image)
    let {type,file,size} = image
    //FILE TYPE
    type = !isEmpty(type) ? type : "";
    if(validator.isEmpty(type)){
        errors.type = "Please provide file type";
    }else{
        let allowedFileType = ["PNG","JPEG"]
        if(!allowedFileType.includes(type.toUpperCase())){
            errors.fileType = "Please Upload valid file type"
        }
    }
    //FILE SIZE
    size = !isEmpty(size) ? size : "";
    if(validator.isEmpty(size)){
        errors.size = "Please provide file size";
    }else
    if(parseInt(size) >= 2097152){
        errors.fileSize = "Please provide file size below 2MB";
    }
    //FILE
    file = !isEmpty(file) ? file : "";
    if(validator.isEmpty(file)){
        errors.file = "Please upload image";
    }

    if(isEmpty(errors)){
        return errors
    }else{
        return errors
    }
}