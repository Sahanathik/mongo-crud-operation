const jwt = require("jsonwebtoken");
const database = require('../helper/db.js');
//const Admin = database.admins;
//const User = database.users;

module.exports = function (req,res,next) {
    
	let token = req.header("x-auth-token");
    let role = req.query.role;
   	if(!token) return res.json({"status": "Failed","message": "Access denied.No token"});
	try{
        if(role == "admin") 
        {
		const decoded = jwt.verify(token, "randomString", );
		req.users = decoded.users;
		next();
        }else{
        return res.json({"status": "Failed","message": "User Access denied"});
        }
	}catch(err){
		res.json({"status": "Failed", "message": err.message});
	}
}