const express = require("express")
const app = express()
const bodyparser = require("body-parser")
const os = require("os")
const cors = require("cors")

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.use(cors());

app.use('/user', require('./user/user.controller'));
//app.use('/admin', require('./admin/admin.controller'));

let server = app.listen(4000, function(){
    console.log("server connected successfully");
})