const mongoose = require("mongoose")
const Schema = mongoose.Schema

const foodSchema = new Schema({
    food : {type: String, required:false},
    //product_qty: {type:String, required:false},
    foodid: {type:String, required: false},
    role : {type: String, required:false},
    Status : {type: String, required:false},
},
{
    timestamps : true,
})

module.exports = mongoose.model('food', foodSchema);