Template.settings.events({

  'click #generate-key': function () {

    Meteor.call('generateApiKey');

  },
  'click #set-from-name': function () {

    Meteor.call('setFromName', $('#from-name').val());

  },
   'click #set-role': function () {

    Meteor.call('setUserRole', $('#user-id :selected').val(), $('#user-role :selected').val());

  },
  'click #add-account': function() {

    account = {
      userId: Meteor.user()._id,
      email: $('#email').val(),
      // from: $('#email-from').val(),
      domainId: $('#domain-id :selected').val()
    }

    Meteor.call('addEmailAccount', account);
  },
  'click #add-domain': function() {

  	// Domain
    domain = {
      userId: Meteor.user()._id,
      url: $('#domain-url').val(),
      name: $('#domain-name').val()
    }

    Meteor.call('addDomain', domain);
  }

});

Template.settings.helpers({

	domains: function() {
		return Domains.find({});
	},
  users: function() {
    return Meteor.users.find({});
  },
  key: function() {
    return Meteor.user().apiKey;
  },
  emailAccounts: function() {
    return EmailAccounts.find({});
  },
  fromName: function() {
    return Meteor.user().fromName;
  }

});

