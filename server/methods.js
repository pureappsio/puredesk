// Import SendGrid
import sendgridModule from 'sendgrid';
const sendgrid = require('sendgrid')(Meteor.settings.sendGridAPIKey);

Meteor.methods({

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
    closeOldTickets: function() {

        // Get all tickets
        var tickets = Tickets.find({}).fetch();

        for (i = 0; i < tickets.length; i++) {

            // Check if pending
            if (tickets[i].status == 'pending') {

                console.log('Pending ticket');

                // Get all messages in descending order
                var messages = Messages.find({ ticketId: tickets[i]._id }, { sort: { date: -1 } }).fetch();

                // Get latest message
                var latestMessage = messages[0];

                console.log('Latest message: ');
                console.log(latestMessage);

                // Check date
                var now = new Date();
                if (now.getTime() - (latestMessage.date).getTime() > 48 * 60 * 60 * 1000) {

                    // Close ticket
                    console.log('Closing ticket');
                    Tickets.update(tickets[i]._id, {$set: {status: 'closed'}});

                }

            }

        }

    },
    setUserRole: function(userId, userRole) {

        // Update user
        Meteor.users.update(userId, { $set: { role: userRole } });

    },
    assignTicket: function(ticketId, userId) {

        console.log(userId);

        // Assign
        Tickets.update(ticketId, { $set: { assignedId: userId } });

    },
    getAllUsers: function() {
        return Meteor.users.find({});
    },
    setFromName: function(fromName) {

        // Update user
        Meteor.users.update(Meteor.user()._id, { $set: { fromName: fromName } });

    },
    replyTicket: function(messageBody, ticketId) {

        // Get email account
        var ticket = Tickets.findOne(ticketId);
        var account = EmailAccounts.findOne(ticket.accountId);

        // Create new message
        var message = {
            ticketId: ticketId,
            body: messageBody,
            userId: Meteor.user()._id,
            date: new Date(),
            senderId: Meteor.user()._id
        }
        console.log(message);
        Messages.insert(message);

        // Update ticket
        Tickets.update(ticketId, { $set: { status: 'pending' } });

        // Assign ?
        if (!ticket.assignedId) {
            Tickets.update(ticketId, { $set: { assignedId: Meteor.user()._id } });
        }

        // Build mail
        var helper = sendgridModule.mail;
        from_email = new helper.Email(account.email);
        to_email = new helper.Email(ticket.sender);
        subject = ticket.subject;
        content = new helper.Content("text/html", messageBody);
        mail = new helper.Mail(from_email, subject, to_email, content);

        // Add from if available
        if (Meteor.user().fromName) {
            mail.from_email.name = Meteor.user().fromName;
        }

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
    createTicket: function(data, user) {

        // Find accounts
        var emailAccount = EmailAccounts.findOne({ email: data.recipient });
        var domain = Domains.findOne(emailAccount.domainId);

        // Check for RE in subject
        data.subject = (data.subject).replace("Re: ", "");

        // Check if ticket already exists
        if (Tickets.findOne({ accountId: emailAccount._id, sender: data.sender, subject: data.subject })) {

            // Ticket
            var ticket = Tickets.findOne({ accountId: emailAccount._id, sender: data.sender, subject: data.subject });

            // Update
            Tickets.update(ticket._id, { $set: { status: 'open' } });

            // Add new message
            var message = {
                ticketId: ticket._id,
                body: data['stripped-text'],
                userId: user._id,
                date: new Date(),
                sender: data.sender
            }
            Messages.insert(message);

        } else {

            // Insert
            var ticket = {

                sender: data.sender,
                accountId: emailAccount._id,
                domainId: domain._id,
                subject: data.subject,
                userId: user._id,
                date: new Date(),
                status: 'open'

            }
            var ticketId = Tickets.insert(ticket);

            // Create first message
            var message = {
                ticketId: ticketId,
                body: data['stripped-text'],
                userId: user._id,
                date: new Date(),
                sender: data.sender
            }
            console.log(message);
            Messages.insert(message);

        }

    },
    deleteTicket: function(ticketId) {

        Tickets.remove(ticketId);

    },
    closeTicket: function(ticketId) {

        Tickets.update(ticketId, { $set: { status: 'closed' } });

    },
    spamTicket: function(ticketId) {

        Tickets.update(ticketId, { $set: { status: 'spam' } });

    },
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

    }

});
