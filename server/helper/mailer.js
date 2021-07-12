const sgMail = require('@sendgrid/mail');
require("dotenv").config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// For sending mails to invitee emails received on API call
function mailer(link, emails, name, passcode) {
    emails.forEach(email => {
        const msg = {
            to: email,
            from: 'guptabhanu1999@gmail.com',
            subject: 'Invite for meeting on Chill Zone',
            html: name + ' is inviting you for a meeting on Chill Zone: <strong><a href=' + process.env.HOSTING_URL + 'join/' + link + '>Join Now</a></strong><br>Meeting Chat Page: <strong><a href=' + process.env.HOSTING_URL + 'chat/' + link + '>Chat</a></strong>' + '<br>Passcode: <strong>' + passcode + '</strong>',
        };
        sgMail
            .send(msg)
            .then(() => {
                console.log('Email sent to ' + email + ' by ' + name);
            }, (err) => next(err))
            .catch((err) => {
                console.error('Email failed from ' + name + ' to ' + email);
            });
    });
}

module.exports = mailer;