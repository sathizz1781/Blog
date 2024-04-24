const mongoose         = require("mongoose");

// Create Schema
const schemaInfo = new mongoose.Schema({
    firstName:{
        alias: "First Name",
		type: String,
		required: true,
		default:''
    },
    lastName:{
		alias: "Status",
		type: String,
		required: true,
		default: ''
	},
	userName: {
		alias: "User Name",
        type: String,
		required: true,
        unique:true,
		default: ''
	},
    password: {
		alias: "Password",
        type: String,
		required: true,
		default: ''
	},
    email:{
        alias: "Email",
		type: String,
        required: true,
        unique:true,
		default:''  
    },
    gender:{
        alias: "Gender",
		type: String,
        required: true,
		default:''  
    },
    dob: {
		alias: "Date of Birth",
        type: Date,
		required: true,
		default: ''
	},
    age: {
		alias: "Age",
        type: Number,
		required: true,
		default: 0
	},
    avatar: {
		alias: "Avatar",
        type: String,
		default: ''
	},
    bio: {
		alias: "Bio",
        type: String,
		default: ''
	},
	lastLogin: {
		alias: "Last Login Date",
        type: Date,
		default: null
	},
	token: {
		alias: "Token",
        type: String,
		default: ''
	},
	createdDate: {
		alias: "Created Date",
		type: Date,
		default:Date.now
	}, 
	updatedDate: {
		alias: "Updated Date",
		type: Date,
		default: null
	}
},{ retainKeyOrder: true ,versionKey: false});

const schemaName = mongoose.model('user',schemaInfo);