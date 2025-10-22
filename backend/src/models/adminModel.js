const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        Unique: true,
        required: true
    },
    role: {
        type: String,
        enum: ['superadmin','admin','modeator', 'support'],
        required:true
    },
    passwordHash: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default:Date.now
    },
    lastActive: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },

    
});

module.exportmongoose.model(Admin, adminSchema);