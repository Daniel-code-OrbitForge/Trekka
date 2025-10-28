const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    paymentId:{
        type: String,
        unique: true,
        required: true
    },
    bookingId:{
        type: Schema.type.ObjectId,
        ref: 'Booking',
        required: true
    },
    paymentstatus:{
        type: String,
        enum: ['Confirmed', 'Denied', 'Pending'],
        required: true
    },
    timeOfPayment : {
        type: Date,
        required: true
    }


});

module.exports = mongoose.model('Payment',paymentSchema)