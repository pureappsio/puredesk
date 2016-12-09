Template.ticket.helpers({

  accountEmail: function() {
    return EmailAccounts.findOne(this.accountId).email;
  },
  assignedName: function() {
    if (this.assignedId) {
    	return 'Assigned to ' + Meteor.users.findOne(this.assignedId).fromName;
    }
    else {
    	return 'Not assigned'
    }
  }

});

Template.ticket.events({

  'click .delete-ticket': function() {
    Meteor.call('deleteTicket', this._id);
  }

});