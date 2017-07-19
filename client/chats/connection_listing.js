Template.connectionListing.events({

    'click .start-chat': function() {

    	Meteor.call('sendMessageConnection', this._id);

    }

});
