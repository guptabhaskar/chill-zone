const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    messageSentOn: {
        type: String,
        enum: ['Meeting', 'ChatPage'],
        default: 'Meeting'
    },
    timestamp: {
        type: String
    },
    message: {
        type: String
    }
});

const meetingSchema = new Schema({
    meetingID: {
        type: String,
        unique: true
    },
    type: {
        type: String,
        enum: ['Normal', 'Lunch'],
    },
    topic: {
        type: String
    },
    passcode: {
        type: String
    },
    messages: [messageSchema],
});

var Meetings = mongoose.model('Meetings', meetingSchema);

module.exports = Meetings;