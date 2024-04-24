const mongoose         = require("mongoose");

// Create Schema
const schemaInfo = new mongoose.Schema({
    comment:{
        alias: "Comment",
		type: String,
		required: true,
		default:''
    },
    postId:{
		alias: "post",
		type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'post'
	},
    createdBy:{
        alias: "Created Date",
		type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'user'
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

const schemaName = mongoose.model('comment',schemaInfo);