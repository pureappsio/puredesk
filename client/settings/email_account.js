Template.emailAccount.events({

  'click .email-delete': function () {

    Meteor.call('deleteAccount', this._id);

  }

});

Template.emailAccount.helpers({

  domainName: function() {
    return Domains.findOne(this.domainId).name;
  }

});