// Import SendGrid
import sendgridModule from 'sendgrid';
const sendgrid = require('sendgrid')(Meteor.settings.sendGridAPIKey);

Meteor.methods({

    createRating: function(ticketId, mark) {

        // Get ticket
        var ticket = Tickets.findOne(ticketId);

        var rating = {
            score: mark,
            operatorId: ticket.assignedId,
            ticketId: ticketId,
            date: new Date()
        }

        console.log(rating);

        Ratings.insert(rating);

        // Return redirect
        var domain = Domains.findOne(ticket.domainId);
        return domain.url;

    },
    sendRatingEmail: function(ticketId) {

        // Get ticket
        var ticket = Tickets.findOne(ticketId);
        var account = EmailAccounts.findOne(ticket.accountId);
        var domain = Domains.findOne(ticket.domainId);

        // Find API key
        var apiKey = Meteor.users.findOne({ apiKey: { $exists: true } }).apiKey;

        // URL
        var url = Meteor.absoluteUrl() + 'ratings';
        url += '?key=' + apiKey;
        url += '&ticket=' + ticketId + '&rating=';

        // Message
        message = "<p>Hello,</p></br>";
        message += "<p>We'd love to hear what you think about the support you received. Please take a moment to answer one simple question by clicking either link below:</p>";
        message += "<p><b>How would you rate the support you received?</b></p>";
        message += "<p><a href='" + url + "1'>Good, I'm satisfied</a></p>"
        message += "<p><a href='" + url + "0'>Bad, I'm unsatisfied</a></p>";

        message = '<div style="font-size: 16px;">' + message + '</div>';

        // Send email
        var helper = sendgridModule.mail;
        from_email = new helper.Email(account.email);
        to_email = new helper.Email(ticket.sender);
        subject = "How would you rate the support you received?";
        content = new helper.Content("text/html", message);
        mail = new helper.Mail(from_email, subject, to_email, content);
        mail.from_email.name = domain.name;

        // Send
        var requestBody = mail.toJSON()
        var request = sendgrid.emptyRequest()
        request.method = 'POST'
        request.path = '/v3/mail/send'
        request.body = requestBody
        sendgrid.API(request, function(err, response) {
            if (!err) {
                console.log('Rating email sent');
            }
        });

    }
    
});
