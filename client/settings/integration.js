Template.integration.events({

  'click .delete-integration': function() {
  	Meteor.call('removeIntegration', this._id);
  }

});

Template.integration.helpers({

  domain: function() {
  	if (this.domainId) {
  		return '[Connected to domain]';
  	}
  	else {
  		return '';
  	}
  }

});