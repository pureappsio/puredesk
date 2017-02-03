Router.configure({
    layoutTemplate: 'layout'
});

// Routes
Router.route('/settings', { name: 'settings' });
Router.route('/send', { name: 'send' });
Router.route('/admin', { name: 'admin' });
Router.route('/tickets', { name: 'tickets' });
Router.route('/chats', { name: 'chats' });
Router.route('/thanks', { name: 'thanks' });
Router.route('/', { name: 'home', data: function() { this.render('tickets') } });

Router.route('/tickets/:_id', {
    name: 'ticketDetails',
    data: function() {
        return Tickets.findOne(this.params._id);
    }
});

Router.route('/chats/:_id', {
    name: 'chatDetails',
    data: function() {
        return Chats.findOne(this.params._id);
    }
});

// Create ticket
Router.route("/api/tickets", { where: "server" }).post(function() {

    // Get post data
    var data = this.request.body;
    var key = this.params.query.key;

    // Find user
    var user = Meteor.users.findOne({ apiKey: key });

    this.response.setHeader('Content-Type', 'application/json');
    if (Meteor.call('validateApiKey', user, key)) {

        // Check data
        if (data.sender && data.recipient && data.subject) {
            Meteor.call('createTicket', data, user);
            this.response.end(JSON.stringify({ message: "Ticket created" }));
        } else {
            this.response.end(JSON.stringify({ message: "Invalid data" }));
        }

    } else {
        this.response.end(JSON.stringify({ message: "API key invalid" }));
    }

});

// Create ticket
Router.route("/api/chats", { where: "server" }).post(function() {

    // Get post data
    var data = this.request.body;
    var key = this.params.query.key;

    console.log(data);

    // Find user
    var user = Meteor.users.findOne({ apiKey: key });

    this.response.setHeader('Content-Type', 'application/json');
    if (Meteor.call('validateApiKey', user, key)) {

        // Check data
        if (data.domain && data.message) {
            var chatId = Meteor.call('startChat', data, user);
            this.response.end(JSON.stringify({ chatId: chatId, message: "Chat started" }));
        } else {
            this.response.end(JSON.stringify({ message: "Invalid data" }));
        }

    } else {
        this.response.end(JSON.stringify({ message: "API key invalid" }));
    }

});

// Create ticket
Router.route("/ratings", { where: "server" }).get(function() {

    // Get post data
    var key = this.params.query.key;
    var ticket = this.params.query.ticket;
    var mark = this.params.query.rating;

    // Find user
    var user = Meteor.users.findOne({ apiKey: key });

    if (Meteor.call('validateApiKey', user, key)) {

        // Check data
        if (ticket && mark) {

            // Create rating
            var redirectUrl = Meteor.call('createRating', ticket, mark);

            // Send thank you
            this.response.writeHead(302, {
                'Location': 'https://' + redirectUrl
            });
            this.response.end();

        }

    }

});
