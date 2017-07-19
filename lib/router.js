Router.configure({
    layoutTemplate: 'layout'
});

// Routes
Router.route('/settings', { name: 'settings' });
Router.route('/send', { name: 'send' });
Router.route('/admin', { name: 'admin' });
Router.route('/tickets', { name: 'tickets' });
Router.route('/templates', { name: 'templates' });
Router.route('/chats', { name: 'chats' });
Router.route('/thanks', { name: 'thanks' });

// Main route
Router.route('/', function() {

    if (!Meteor.userId()) {

        this.render('login');

    } else {

        this.render('tickets');

    }

});

Router.route('/login', {
    name: 'login'
});

Router.route('/signup', {
    name: 'signup'
});

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