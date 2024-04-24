const mongoose         = require("mongoose");

// Create Schema
const schemaInfo = new mongoose.Schema({
	postName:{
        alias: "Post Name",
		type: String,
		required: true,
		default:''
    },
    headline:{
        alias: "Headline",
		type: String,
		required: true,
		default:''
    },
    paragraph:{
		alias: "Paragraph",
		type: String,
		default: ''
	},
	image: {
		alias: "Image",
        type: String,
		default: ''
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

const schemaName = mongoose.model('post',schemaInfo);