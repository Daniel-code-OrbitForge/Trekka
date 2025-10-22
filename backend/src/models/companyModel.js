const mongoose = require('mongoose');
const Schema = mongoose.Schema

const companySchema= new Schema({
    comapnyId:{
        type: String,
        unique: true,
        required: true
    },
    companyName:{
        type: String,
        required:true
    },
    address: {
        type: String,
        required: true
    },

});

module.exports = mongoose.model('Company',companySchema)