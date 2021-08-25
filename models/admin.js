const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require("crypto");

const adminSchema = new Schema({
	name: {type: String, required: false },
	aid: {type: String, required: false, unique: true},
	email: {type: String, required: false, unique: true},
	password: {type:String, required: false},
	login_status : {type:Boolean, required: false},
	verify_token : {type:String, required: false},
	role : {type:String, required: false},

},{
	timestamps: true
});

adminSchema.pre("save", function(next){
	this.uuid = "usr"+ crypto.pseudoRandomBytes(6).toString('hex').toUpperCase()
	next();
})

module.exports = mongoose.model('admin', adminSchema);