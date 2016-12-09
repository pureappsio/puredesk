Template.ticketDetails.helpers({

  messages: function() {
    return Messages.find({ticketId: this._id});
  },
  accountEmail: function() {
    return EmailAccounts.findOne(this.accountId).email;
  },
  accountName: function() {
    return EmailAccounts.findOne(this.accountId).email;
  },
  assignedName: function() {
  	if (this.assignedId) {
  	  return Meteor.users.findOne(this.assignedId).fromName;
  	}
  	else {
  	  return 'Not assigned';
  	}
    
  },
  users: function() {
  	return Meteor.users.find({});
  }
 
});

Template.ticketDetails.events({

  'click #reply-ticket': function() {

  	// Reply
  	messageBody = $('#email-text').summernote('code');
    Meteor.call('replyTicket', messageBody, this._id);

  },
  'click #mark-closed': function() {

  	// Reply
    Meteor.call('closeTicket', this._id);

  },
  'click #mark-spam': function() {

  	// Reply
    Meteor.call('spamTicket', this._id);

  },
  'click #assign': function() {

  	// Reply
    Meteor.call('assignTicket', this._id, $('#assigned-id :selected').val());

  }
 
});

Template.ticketDetails.onRendered(function() {

	// Message
	$('#email-text').summernote({
      height: 150
    });

});