Template.chatListing.helpers({

  formatDate: function() {
    return moment(this.date).format('MMMM Do YYYY, h:mm:ss a');
  },
  lastMessage: function() {
  	return Messages.findOne({chatId: this._id}, {sort: {date: -1}}).content;
  }

});

Template.chatListing.events({

  'click .delete-chat': function() {
    Meteor.call('deleteChat', this._id);
  }

});