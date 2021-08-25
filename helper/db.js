const config = require("../config.json")
const mongoose = require("mongoose")

//mongo connection
mongoose.connect(config.connectionString,{   
    useCreateIndex : true,
    useNewUrlParser : true,
    useUnifiedTopology : true

});
//jhji

mongoose.Promise = global.Promise;
let database = mongoose.connection;

database.on('error', console.error.bind(console, 'connection error:'));
database.once('open', function () {
    console.log("Mongo connection success...");
});

module.exports = {
    users: require('../models/user.js'),
    foods: require('../models/food.js'),
}