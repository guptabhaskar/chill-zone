const express = require('express');
const { uuid } = require("uuidv4");
var mailer = require("../helper/mailer");

const meetingRouter = express.Router();
meetingRouter.use(express.json());

const Meetings = require("../models/meeting")

meetingRouter.route('/meeting')
    .get((req, res, next) => { // For checking if a meeting exists using id
        Meetings.findOne({ meetingID: req.query.id })
            .then((meeting) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(meeting);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => { // To create a new meeting
        var id = uuid();
        var passcode;
        if (req.body.type === 'Lunch') { // Set passcode of 'Lunch' type meeting to 000000
            passcode = '000000'
        } else {
            passcode = Math.floor(100000 + Math.random() * 900000); // Set passcode of 'Normal' type meeting to random 6 digit
            if (req.body.emails) {
                mailer(id, req.body.emails, req.body.name, passcode);
            }
        }
        Meetings.create({ meetingID: id, type: req.body.type, topic: req.body.topic, passcode: passcode })
            .then(() => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    id: id,
                    passcode: passcode
                });
            }, (err) => next(err))
            .catch((err) => next(err));
    })

meetingRouter.route('/lunchMeeting')
    .get((req, res, next) => { // To get list of all lunch meetings
        Meetings.find({ type: 'Lunch' })
            .then((meetings) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(meetings);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

meetingRouter.route('/messages')
    .get((req, res, next) => { // To get all messages of a meeting using id
        Meetings.findOne({ meetingID: req.query.id })
            .then((meeting) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(meeting.messages);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => { // To add a new message to meeting message array
        const updateQuery = { "$addToSet": { "messages": req.body.message } };
        Meetings.findOneAndUpdate({ meetingID: req.body.id }, updateQuery)
            .then(() => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ "success": true });
            }, (err) => next(err))
            .catch((err) => next(err));
    })

module.exports = meetingRouter;