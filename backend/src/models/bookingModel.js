const mongoose = require('moongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    bookingid: {
        type: String,
        required: true,
        unique: true,
        index: true
     },
     ticketid: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    customerid: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bookingid: {
        type: Date,
        required: true
    },
    bookingstatus:{
        type: String,
        enum: ['confirmed','cancelled','pending']
    },
    paymentInfo: {
        type: Schema.Types.ObjectId,
        ref: 'Payment',
        required: true
    }
})

module.exports = mongoose.model('Booking',bookingSchema)