// Import SendGrid
import sendgridModule from 'sendgrid';
const sendgrid = require('sendgrid')(Meteor.settings.sendGridAPIKey);

Meteor.methods({

    validateApiKey: function(user, key) {

        if (user.apiKey == key) {
            return true;
        } else {
            return false;
        }

    },
    generateApiKey: function() {

        // Check if key exist
        if (!Meteor.user().apiKey) {

            // Generate key
            var key = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 16; i++) {
                key += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            console.log(key);

            // Update user
            Meteor.users.update(Meteor.user()._id, { $set: { apiKey: key } });
        }

    },
    addDomain: function(domain) {

        // Insert
        console.log(domain);
        Domains.insert(domain);

    },

    addEmailAccount: function(account) {

        // Insert
        console.log(account);
        EmailAccounts.insert(account);

    },
    deleteAccount: function(accountId) {

        // Insert
        EmailAccounts.remove(accountId);

    },
    sendEmail: function(email) {

        console.log(email);

        // Get email account
        var account = EmailAccounts.findOne(email.accountId);

        // Build mail
        var helper = sendgridModule.mail;
        from_email = new helper.Email(account.email);
        to_email = new helper.Email(email.to);
        subject = email.subject;
        content = new helper.Content("text/html", email.text);
        mail = new helper.Mail(from_email, subject, to_email, content);

        mail.from_email.name = email.from;

        // Send
        var requestBody = mail.toJSON()
        var request = sendgrid.emptyRequest()
        request.method = 'POST'
        request.path = '/v3/mail/send'
        request.body = requestBody
        sendgrid.API(request, function(err, response) {
            if (response.statusCode != 202) {
                console.log(response.body);
            }
        });

    },

    getAllUsers: function() {
        return Meteor.users.find({});
    },
    setFromName: function(fromName) {

        // Update user
        Meteor.users.update(Meteor.user()._id, { $set: { fromName: fromName } });

    },

    setUserRole: function(userId, userRole) {

        // Update user
        Meteor.users.update(userId, { $set: { role: userRole } });

    },

    restrictUser: function(userId, domains) {

        Meteor.users.update(userId, { $set: { domains: domains } });
        console.log(Meteor.users.findOne(userId));

    },
    getDomains: function() {

        return Domains.find({}).fetch();

    },
    createUsers: function() {

        // Create admin user
        var adminUser = {
            email: Meteor.settings.adminUser.email,
            password: Meteor.settings.adminUser.password,
            role: 'admin'
        }
        Meteor.call('createNewUser', adminUser);

    },
    createNewUser: function(data) {

        // Check if exist
        if (Meteor.users.findOne({ "emails.0.address": data.email })) {

            console.log('User already created');
            var userId = Meteor.users.findOne({ "emails.0.address": data.email })._id;

            // Change role
            Meteor.users.update(userId, { $set: { role: data.role } });

        } else {

            console.log('Creating new user');

            // Create
            var userId = Accounts.createUser(data);

            // Change role
            Meteor.users.update(userId, { $set: { role: data.role } });
            console.log(Meteor.users.findOne(userId));

        }

    },

    sendSummaryEmail: function() {

        // Find admin
        var adminUser = Meteor.users.findOne({ role: 'admin' });

        // Find operators
        var operators = Meteor.users.find({ role: 'operator' }).fetch();

        // Build array of operator IDs
        var operatorIds = [];
        for (i in operators) {
            operatorIds.push(operators[i]._id);
        }

        // Get all daily answered tickets
        var currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 1);
        var repliedTickets = Tickets.find({ assignedId: { $in: operatorIds }, date: { $gte: currentDate } }).fetch();

        // Build message
        var message = "";

        message += '<h1>Processed tickets: ' + repliedTickets.length + '</h1>';

        for (t in repliedTickets) {

            // Get all messages
            var messages = Messages.find({ ticketId: repliedTickets[t]._id }).fetch();

            // Get operator
            var operator = Meteor.users.findOne(repliedTickets[t].assignedId);

            message += '<h3>Ticket subject: ' + repliedTickets[t].subject + '</h3>';
            message += '<h4>Answered by: ' + operator.fromName + '</h4>';

            for (m in messages) {
                if (message[m].sender) {
                    var replier = 'Client'
                } else {
                    var replier = 'Operator';
                }

                date = moment(message[m].date).format('hh:mm');

                message += '<div><b>' + replier + ' at ' + date + ': </b>' + messages[m].body + '</div></br>';

            }

        }

        console.log(message);

        // Send email
        var helper = sendgridModule.mail;
        from_email = new helper.Email('automation@schwartzindustries.com');
        to_email = new helper.Email(adminUser.emails[0].address);
        subject = 'Daily Summary of Processed Tickets';
        content = new helper.Content("text/html", message);
        mail = new helper.Mail(from_email, subject, to_email, content);
        mail.from_email.name = 'PureDesk';

        // Send
        var requestBody = mail.toJSON()
        var request = sendgrid.emptyRequest()
        request.method = 'POST'
        request.path = '/v3/mail/send'
        request.body = requestBody
        sendgrid.API(request, function(err, response) {
            if (response.statusCode != 202) {
                console.log(response.body);
            }
        });

    }

});
