Router.configure({
  layoutTemplate: 'layout'
});

// Routes
Router.route('/settings', {name: 'settings'});
Router.route('/send', {name: 'send'});
Router.route('/tickets', {name: 'tickets'});
Router.route('/', {name: 'home', data: function() { this.render('tickets') }});

Router.route('/tickets/:_id', {
    name: 'ticketDetails',
    data: function() { return Tickets.findOne(this.params._id); }
});

// Create ticket
Router.route("/api/tickets", { where: "server" } ).post( function() {

  // Get post data
  var data = this.request.body;
  var key = this.params.query.key;

  // Find user
  var user = Meteor.users.findOne({apiKey: key});

  this.response.setHeader('Content-Type', 'application/json');
  if (Meteor.call('validateApiKey', user, key)) {

    // Check data
    if (data.sender && data.recipient && data.subject) {
      Meteor.call('createTicket', data, user);
      this.response.end(JSON.stringify({message: "Ticket created"}));
    }
    else {
      this.response.end(JSON.stringify({message: "Invalid data"}));
    }

  }
  else {
    this.response.end(JSON.stringify({message: "API key invalid"}));
  }

});
