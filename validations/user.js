const validator         = require("validator");
const isEmpty           = require("is-empty");
const common_validation = require("./common")
const common            = require("../modules/common")
const common_obj        = new common()

exports.login = async function login(request,callback){
    let errors = {};
    let inputFields = common_obj.remove_spaces(request)
    let {userName,password} = inputFields

    //USER NAME
    userName = !isEmpty(userName) ? userName : "";
    if(validator.isEmpty(userName)){
        errors.userName = "Please provide user name";
    }

    //USER NAME
    password = !isEmpty(password) ? password : "";
    if(validator.isEmpty(password)){
        errors.password = "Please provide password";
    }

    if(isEmpty(errors)){
        return callback({"statusCode":200, status:true,message:"Validated successfully !!!",result:{},error:{}})
    }else{
        return callback({"statusCode":403, status:false,message:"Validation fail",result:{},error:errors})
    }
}

exports.register = async function register(request,callback){
    let errors = {};
    let inputFields = common_obj.remove_spaces(request)
    let {firstName,lastName,userName,password,confirmPassword,email,dob,gender,bio,avatar} = inputFields
    //IMAGE FILE
    if(avatar && avatar.file.trim() !== ""){
        let img_rslt =  common_validation.imageValidation(avatar)
        errors = {...errors,...img_rslt}
    }
    //FIRST NAME
    firstName = !isEmpty(firstName) ? firstName : "";
    if(validator.isEmpty(firstName)){
        errors.firstName = "Please provide first name";
    }
    //LAST NAME
    lastName = !isEmpty(lastName) ? lastName : "";
    if(validator.isEmpty(lastName)){
        errors.lastName = "Please provide last name";
    }
    //USER NAME
    userName = !isEmpty(userName) ? userName : "";
    if(validator.isEmpty(userName)){
        errors.userName = "Please provide user name";
    }
    //EMAIL
    email = !isEmpty(email) ? email : "";
    if(validator.isEmpty(email)){
        errors.email = "Please provide email";
    }else
    if(!validator.isEmail(email)){
        errors.email = "Please provide valid email";
    }
    //PASSWORD
    password = !isEmpty(password) ? password : "";
    if(validator.isEmpty(password)){
        errors.password = "Please enter your password";
    }else
    if(!validator.isLength(password, { min: 8, max: 16 })){
        errors.password = "Please enter min 8 & Max 16 digit alphanumeric password";
    }else{
        var is_alpha = (/^(?=.*\d)(?=.*[!@#$%^&*-])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password));
        if(!is_alpha){
            errors.password = "Password should be at least 8 characters and should include at least one upper case, one number, and one special character.";
        }
    }
    //CONFIRMATION PASSWORD
    confirmPassword = !isEmpty(confirmPassword) ? confirmPassword : "";
    if(validator.isEmpty(confirmPassword)){
        errors.confirmPassword = "Please enter your confirmation password";
    }else 
    if(password && (password !== confirmPassword)){
        errors.confirmPassword = "Password & Confirmation password must be equal";
        errors.password        = "Password & Confirmation password must be equal";
    }
    //GENDER
    gender = !isEmpty(gender) ? gender : "";
    if(validator.isEmpty(gender)){
        errors.gender = "Please provide gender";
    }else{
        let allowedGender = ["MALE","FEMALE","OTHERS"]
        if(!allowedGender.includes(gender.toUpperCase())){
            errors.gender = "Please provide valid gender"
        }
    }
    //DATE OF BIRTH
    if((dob) && (!validator.isEmpty(dob))){
        var datePattern =/^([0-9]{4})\-([0-9]{2})\-([0-9]{2})$/;  // 2024-04-21
        if(!datePattern.test(dob)){
            errors.dob = "Please provide date of birth in YYYY-MM-DD format";
        }
    }
    
    
    if(isEmpty(errors)){
        return callback({"statusCode":200, status:true,message:"Validated successfully !!!",result:{},error:{}})
    }else{
        return callback({"statusCode":403, status:false,message:"Validation fail",result:{},error:errors})
    }
}

exports.view = async function view(request,callback){
    let errors = {};
    let inputFields = common_obj.remove_spaces(request)
    let {email} = inputFields

    //EMAIL
    email = !isEmpty(email) ? email : "";
    if(validator.isEmpty(email)){
        errors.email = "Please provide email";
    }else
    if(!validator.isEmail(email)){
        errors.email = "Please provide valid email";
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

    //IMAGE FILE
    if(inputFields.avatar.file.trim() !== ""){
        let img_rslt =  common_validation.imageValidation(inputFields.avatar)
        errors = {...errors,...img_rslt}
    }
    
    //USER NAME
    inputFields.userName = !isEmpty(inputFields.userName) ? inputFields.userName : "";
    if(validator.isEmpty(inputFields.userName)){
        errors.userName = "Please provide user name";
    }
    
    //GENDER
    if(inputFields.gender !== ""){
        let allowedGender = ["MALE","FEMALE","OTHERS"]
        if(!allowedGender.includes(inputFields.gender.toUpperCase())){
            errors.gender = "Please provide valid gender"
        }
    }
    //DATE OF BIRTH
    if(inputFields.dob !== ""){
        if((inputFields.dob) && (!validator.isEmpty(inputFields.dob))){
            var datePattern =/^([0-9]{4})\-([0-9]{2})\-([0-9]{2})$/;  // 2024-04-22
            if(!datePattern.test(inputFields.dob)){
                errors.dob = "Please provide date of birth in YYYY-MM-DD format";
            }
        }
    }
    
    
    if(isEmpty(errors)){
        return callback({"statusCode":200, status:true,message:"Validated successfully !!!",result:{},error:{}})
    }else{
        return callback({"statusCode":403, status:false,message:"Validation fail",result:{},error:errors})
    }
}

exports.delete = async function delet(request,callback){
    let errors = {};
    let inputFields = common_obj.remove_spaces(request)
    
    //EMAIL
    inputFields.email = !isEmpty(inputFields.email) ? inputFields.email : "";
    if(validator.isEmpty(inputFields.email)){
        errors.email = "Please provide email";
    }else
    if(!validator.isEmail(inputFields.email)){
        errors.email = "Please provide valid email";
    }
    
    if(isEmpty(errors)){
        return callback({"statusCode":200, status:true,message:"Validated successfully !!!",result:{},error:{}})
    }else{
        return callback({"statusCode":403, status:false,message:"Validation fail",result:{},error:errors})
    }
}