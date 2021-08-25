const database = require('../helper/db.js');
const jwt = require('jsonwebtoken');
const user = require('../models/user.js');
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { getMaxListeners } = require('../models/user.js');
const User = database.users;
const Food = database.foods;
const ejs = require("ejs");
const {join} = require("path");
const fast2sms = require("fast-two-sms");
const config = require("../config.json");

const mailTransport = nodemailer.createTransport({
	"service": "gmail",
	"auth": {
		user: "sahamsg@gmail.com",
		pass: "Ahmad2016_"
	}
});
module.exports = {
    register,
    login,
    addFood,
	deleteAlltheUsers,
	updatetheFoodDetails,
	deleteAlltheFood,
	deleteFoodDetails,
	resetPassword,
	addFoodbyUser,
	forgotPassword,
	getFoodDetails,
	deactivateTheAccount,
	getTheFoodAndUserDetails,
	OrderStatus,
	getIndiDetails,
	getTheFoodAndUserDetailsbyId,
	userOrderStatus,
	
}

async function updatetheFoodDetails(req,callback){
	let condition = req._id;
	let update = req.updateobj;
	let option = { multi : true};
	await Food.findOneAndUpdate(condition, update, option).exec().then((data) =>{
		callback(data);
	})
}

function generateOTP() {
          
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++ ) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}
let otp = generateOTP()
  

function sendSms(data){
	let options = {
		authorization: config.sms_api_key,
		message: data.message,
		numbers: [data.number]
	}
	fast2sms.sendMessage(options).then((data)=>{
		console.log("msg send")
	}).catch(err => {
		console.log(err.message);
	})
}

function sendMail(details){
	ejs.renderFile(join(__dirname, "../views", details.fileName), {"details":details.mailDetails},function(err,data){
	if(err){
		console.log(err);
	}else{
		let mailData;
		if(details.attachments){
			mailData = {
				from : "sahamsg@gmail.com",
				to : details.to,
				subject : details.subject,
				html : data,
				attachments : details.attachments
			}
		}else{
			mailData = {
				from: "sahamsg@gmail.com",
				to : details.to,
				subject : details.subject,
				html : data,
			}
		}
		mailTransport.sendMail(mailData, function(err,data){
			if(err){
				console.log(err);
			}else{
				console.log("email sent")
			}
		})
	}	
	})
}



async function register(req, res, next) {
	let email = req.body.email;
	let password = req.body.password;
	const email_detail = await User.find({"email": email}).exec();
	console.log(email_detail);
	let maildata = {
		from : "sxxxxx@gmail.com",
		to : email,
		subject : "success",
		text : "User Registration successful"
	}
    mailTransport.sendMail(maildata, function(err,data){
		if(err){
			console.log(err);
		}else
		{
			console.log("mail sent");
		}
	})
	console.log(maildata);

	if(email_detail.length>0){
		throw res.json({"status": "Failed", "message": "email already exists"});
	}
	let users = new User(req.body);
	if(req.body.password){
		let password = req.body.password;
		let salt = await bcrypt.genSalt(10);
		users.password = bcrypt.hashSync(password, salt);
		users.save();
		res.json({"status": "Success", "message": "Register successfully"});
	}else{
		res.json({"status": "Failed", "message": "Please Provide password"});
	}
}

async function deleteAlltheUsers(req,res,next){
	await User.deleteMany({}).exec();
	const users_details = await User.find().exec();
	if(users_details>0){
		res.json({"status": "Failed", "message": "Documents are not deleted"});
	}else{
        res.json({"status": "Success", "message": "All the Documents are deleted"});
	}
}

async function deleteAlltheFood(req,res,next){
	await Food.deleteMany({}).exec();
	const food_details = await Food.find().exec();
	if(food_details>0){
		res.json({"status": "Failed", "message": "Documents are not deleted"});
	}else{
        res.json({"status": "Success", "message": "All the Food Details are deleted"});
	}
}

async function deleteFoodDetails(req,callback){
	await Food.findByIdAndRemove(req).exec().then((data)=>{
		callback(data)
	})
}

async function login(req,res,next) {
	let email = req.query.email;
	let password = req.query.password;
	console.log(password);
	let role = req.query.role
	let users= await User.findOne({"email": email}).exec();
	let match = await bcrypt.compare(password, users.password);
	console.log(match);
	let payload = {users:{id : users.uuid, role: user}};
    console.log(payload);
	let signature = "randomString";
	let token = jwt.sign(payload, signature, {expiresIn: 10000});
	console.log(token);
	let data = await User.findOneAndUpdate({email:email},{login_status:true, verify_token:token},{new:true});
	if(match){
		res.json({"status": "Success", "message": "Login successfully", "data":data});
	}else{
		res.json({"status": "Failed", "message": "Username or password wrong"});
	}
}

async function addFood(req, callback){
	const food = new Food(req);
	await food.save().then((data) => {
		callback(data);
	});
};

async function resetPassword(req,res,next){
	let email = req.query.email;
	let OldPassword = req.query.password;
	let NewPassword = req.query.new_password;
	let users = await User.findOne({"email":email}).exec();
	let pass = users.password;
	let match = await bcrypt.compare(OldPassword, pass);
	if(match){
		res.json({"status":"Failed", "message":"Please enter correct password"})
	}else{
		let salt = await bcrypt.genSalt(10);
		let pass = bcrypt.hashSync(NewPassword, salt);
		const data = await User.findOneAndUpdate({email:email},{password:pass},{new:true});
		res.json({"status":"Success", "message":"Password has been changed"});
	}

}

async function forgotPassword(req,res,next){
	let email = req.query.email;
	let NewPassword = req.query.password;
	let users = await User.findOne({"email":email}).exec();
	let salt = await bcrypt.genSalt(10);
	let pass = bcrypt.hashSync(NewPassword, salt);
	console.log(pass);
    let data = await User.findOneAndUpdate({email:email},{password:pass},{new:true}).exec();
	res.json({"status": "Success", "message": "Password has been changed"});
}
async function addFoodbyUser(req,callback){
	let foods = new Food(req);
	await foods.save().then((data)=>{
		callback(data);
	})

}

async function OrderStatus(req,res,next){
	let uuid = req.query.uuid;
	let Order_status = req.query.status;
	let email = req.query.email;
    //let users = await User.findOne({"email":email}).exec();
	let users  = await user.findOne({"email": email}).exec();
	console.log(users);
	let data = await User.findOneAndUpdate({uuid:uuid},{status:Order_status},{new:true}).exec();
	if(Order_status == "Approved")
	{
		res.json({"status": "Approved", "message": "Order has been approved", "data": data});
	} else
	{
		res.json({"status": "Rejected", "message": "Order has been rejected"});
	}
	
	let details = {
		to : users.email,
		subject : "test function",
		fileName : "sample.ejs",
		mailDetails:{
			designation:"developer",
			company:"infosys",
			name:"saha",
		},
		attachments:[{
			filename : "sample_project_doc",
			path : "C:\Users\admin\Downloads\sample_project_doc.docx"

		}]
	}

	sendMail(details);

	let smsData = {
		message : otp,
		"number":"8345652165"
	}
	sendSms(smsData);
}


async function userOrderStatus(req,res,next){
	let uuid = req.query.uuid;
	let Order_status = req.query.user_status;
	let data = await User.findOneAndUpdate({uuid:uuid},{user_status:Order_status},{new:true}).exec();
	res.json({"status": "Cancelled", "message": "Order has been Cancelled by user", "data": data});
}

async function getFoodDetails(req,callback){
	await Food.find(req).exec().then((data)=>{
		callback(data);
	})
}

//delete user
async function deactivateTheAccount(req,callback){
	await User.findByIdAndRemove(req).exec().then((data)=>{
		callback(data);
	})
}

// get the food and user details
async function getTheFoodAndUserDetails(req,callback) {
	await User.aggregate([
		{
			$lookup:{
				from:"foods",
				localField: "uuid",
				foreignField: "foodid",
				as:"foods_details"
			}
		}
	]).exec().then((data)=>{
		callback(data);
	});
};

async function getIndiDetails(req,callback) {
	await User.findOne({"email": req.email}).exec().then((data)=>{
		callback(data);
	})
};

async function getTheFoodAndUserDetailsbyId(req,callback) {
	let mail = await User.findOne({"email": req.email}).exec();
	if(mail){
	await User.aggregate([
		{
			$lookup:{
				from:"foods",
				localField: "uuid",
				foreignField: "foodid",
				as:"foods_details"
			}
		}
	]).exec().then((data)=>{
		callback(data);
	});
}
};

