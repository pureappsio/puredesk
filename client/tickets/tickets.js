Template.tickets.helpers({

  tickets: function() {

  	if (Session.get('tickets')) {

  		var type = Session.get('tickets');
      var user = Meteor.user();

  		if (type == 'all') {
  			return Tickets.find({status: 'open', assignedId: Meteor.user()._id}, {sort: {date: -1}});
  		}
  		if (type == 'opened') {
  			return Tickets.find({status: 'open', assignedId: { $exists: false }}, {sort: {date: -1}});
  		}
  		if (type == 'active') {
  			return Tickets.find({status: { $in: ['open', 'pending'] }}, {sort: {date: -1}});
  		}
  		if (type == 'closed') {
  			return Tickets.find({status: { $in: ['closed', 'spam'] }}, {sort: {date: -1}});
  		} 

  	}
  	else {
  		return Tickets.find({}, {sort: {date: -1}});
  	}
    
  },
  allTickets: function() {
    return Tickets.find({status: 'open', assignedId: Meteor.user()._id}, {sort: {date: -1}}).fetch().length;
  },
  activeTickets: function() {
    return Tickets.find({status: { $in: ['open', 'pending'] }}, {sort: {date: -1}}).fetch().length;
  },
  closedTickets: function() {
    return Tickets.find({status: { $in: ['closed', 'spam'] }}, {sort: {date: -1}}).fetch().length;
  },
  openedTickets: function() {
    return Tickets.find({status: 'open', assignedId: { $exists: false }}, {sort: {date: -1}}).fetch().length;
  }

});

Template.tickets.events({

  'click #set-all': function() {

  	Session.set('tickets', 'all');

  },
  'click #set-closed': function() {

  	Session.set('tickets', 'closed');

  },
  'click #set-opened': function() {

  	Session.set('tickets', 'opened');

  },
  'click #set-active': function() {

  	Session.set('tickets', 'active');

  }

});