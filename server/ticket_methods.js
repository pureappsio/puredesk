// Import SendGrid
import sendgridModule from 'sendgrid';
const sendgrid = require('sendgrid')(Meteor.settings.sendGridAPIKey);

Meteor.methods({

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

            // Check for data on customer
            ticket.type = Meteor.call('getTicketType', data.sender);

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

        // Close
        Tickets.update(ticketId, { $set: { status: 'closed' } });

        // Send rating email
        Meteor.call('sendRatingEmail', ticketId);


    },
    spamTicket: function(ticketId) {

        Tickets.update(ticketId, { $set: { status: 'spam' } });

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

    assignTicket: function(ticketId, userId) {

        console.log(userId);

        // Assign
        Tickets.update(ticketId, { $set: { assignedId: userId } });

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
                    Tickets.update(tickets[i]._id, { $set: { status: 'closed' } });

                    // Send rating message
                    Meteor.call('sendRatingEmail', tickets[i]._id);

                }

            }

        }

    },
    getProducts: function(domainId) {

        // Get domain data
        var domain = Domains.findOne(domainId);

        // Get products
        if (Integrations.findOne({ type: 'purepress', url: domain.url })) {

            // Get integration
            var integration = Integrations.findOne({ type: 'purepress', url: domain.url});
            var answer = HTTP.get('https://' + integration.url + '/api/products?key=' + integration.key);

            console.log(answer.data.products);

            return answer.data.products;

        } else {
            return [];
        }

    },
    getTicketType: function(customerEmail) {

        // Unknown by default
        var type = 'unknown';

        // Check if is customer
        if (Integrations.findOne({ type: 'purecart' })) {

            // Get integrations
            var integrations = Integrations.find({ type: 'purecart' }).fetch();

            for (i in integrations) {

                console.log('https://' + integrations[i].url + '/api/customers/' + customerEmail + '?key=' + integrations[i].key);

                var answer = HTTP.get('https://' + integrations[i].url + '/api/customers/' + customerEmail + '?key=' + integrations[i].key);

                if (answer.data.email) {
                    type = 'customer';
                }

            }

        }

        // Check if is lead
        if (type == 'unknown') {

            if (Integrations.findOne({ type: 'puremail' })) {

                // Get integration
                var integration = Integrations.findOne({ type: 'puremail' });

                var answer = HTTP.get('https://' + integration.url + '/api/subscribers/' + customerEmail + '?key=' + integration.key);

                if (answer.data._id) {
                    type = 'lead';
                }

            }

        }

        return type;

    }

});
