const express = require('express');
const router = express.Router();
const userService = require('./user.service.js');
const auth = require('../middleware/auth.js')

router.post('/register', userService.register);
router.get('/login', userService.login);
router.post('/addFood', auth, addFood);
router.delete('/deleteAlltheUsers', userService.deleteAlltheUsers);
router.put('/updatetheFoodDetails',auth,updatetheFoodDetails)
router.delete('/deleteAlltheFood', userService.deleteAlltheFood);
router.delete('/deleteFoodDetails', auth,deleteFoodDetails);
router.put('/resetPassword', userService.resetPassword);
router.put('/forgotPassword', userService.forgotPassword);
router.post('/addFoodbyUser', addFoodbyUser)
router.get('/getFoodDetails', getFoodDetails);
router.get("/getTheFoodAndUserDetails", auth,getTheFoodAndUserDetails);
router.delete('/deactivateTheAccount', deactivateTheAccount);
router.put('/OrderStatus', userService.OrderStatus);
router.get('/getIndiDetails', getIndiDetails);
router.get('/getTheFoodAndUserDetailsbyId', getTheFoodAndUserDetailsbyId);
router.put('/userOrderStatus', userService.userOrderStatus);

module.exports = router;

function addFood(req, res, next){
	userService.addFood(req.query, function(result){
		res.json({ "status":"Success", "message": "Food has been added Successfully","data": result });
	});
};

function updatetheFoodDetails(req,res,next){
	userService.updatetheFoodDetails(req.body, function(result){
		res.json({"status": "Success", "message": "user details", "data": result})
	})
}

function deleteFoodDetails(req,res,next){
	userService.deleteFoodDetails(req.query, function(result){
		res.json({"status":"Success", "message":"Food Details deleted","result": result})
	})
}

function addFoodbyUser(req,res,next){
	userService.addFoodbyUser (req.query, function(result){
		res.json({"status":"Success", "message":"Food Details added by user","result": result})
	})
}

function getFoodDetails(req,res,next){
	userService.getFoodDetails(req.query, function(result){
		res.json({"status":"Success", "message":"User Details","result": result})
	})
}

function deactivateTheAccount(req,res, next) {
	userService.deactivateTheAccount(req.query, function(result){
		res.json({"status": "Success", "message": "Account has been deactivated"})
	})
}

function getTheFoodAndUserDetails(req,res,next){
	userService.getTheFoodAndUserDetails(req, function(result) {
		res.json({"status": "Success", "message": "Food details", "data": result});
	})
}

// get the individual details
function getIndiDetails(req,res,next) {
	userService.getIndiDetails(req.query, function(result) {
		res.json({"status": "Success", "message": "Indi-User details fetched successfully", "data":result})
	})
}

function getTheFoodAndUserDetailsbyId(req,res,next){
	userService.getTheFoodAndUserDetailsbyId(req.query, function(result) {
		res.json({"status": "Success", "message": "Food details", "data": result});
	})
}

