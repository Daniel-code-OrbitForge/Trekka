const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userId:{
        type: String,
        unique: true,
        required: true
    },
    userFirstName: {
        type: String,
        required: true
    },
    userLastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true,
    },
    passwordHashed:{
        type: String,
        required: true,
        unique: true
    },
})
module.exports  = mongoose.model('User',userSchema)