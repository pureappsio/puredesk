Template.message.helpers({

  senderName: function() {
    if (this.sender) {
      return this.sender;
    }
    if (this.senderId) {
      return Meteor.users.findOne(this.senderId).fromName;
    }
  }

});