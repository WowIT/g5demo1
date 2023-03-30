

let mongoose = require('mongoose');

// create a model class
let incidentModel = mongoose.Schema({
    description: String,
    priority: {
        type: String,
        default: "Normal",         // e.g. Low, Normal, High
        trim: true
    },
    customerInfo: String,
    recordNumber: String,       // e.g. 130418-0000001 for Apr 13 2018, ticket no 1
    narrative: String,          // e.g. 25/10/2020 - Changed status "normal" to "high"; 6/11/2020 - Ticket closed
    narrativeLatest: String,
    status: {
        type: String,
        default: "New",         // e.g. New, In Progress, Closed
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    }
},{
    collection: 'incidents'
});

module.exports = mongoose.model('Incident', incidentModel);
