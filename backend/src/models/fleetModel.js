const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fleetSchema = new Schema({
    companyId:{
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true, 
    },
    fleetId:{
        type: String,
        required: true,
        unique: true
    },
    fleetName:{
        type: String,
        required: true
    },
    fleetModel: {
        type: String,
        required: true
    },
    fleetPlateNmber:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Fleet', fleetSchema)