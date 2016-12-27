Template.settings.onRendered(function() {

  // Init picker
  $('#restrict-domains').selectpicker();

  // Fill picker
  Meteor.call('getDomains', function(err, domains) {

    for (i = 0; i < domains.length; i++) {
      $('#restrict-domains').append($('<option>', {
        value: domains[i]._id,
        text: domains[i].name
      }));
    }

    // Refresh picker
    $('#restrict-domains').selectpicker('refresh');

  });

});

Template.settings.events({

  'click #restrict-user': function() {

    Meteor.call('restrictUser', $('#restrict-user-id :selected').val(), $('#restrict-domains').val());

  },
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

  transferRate: function() {

    // Get date
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 7);

    // Return
    var assignedTickets = Tickets.find({assignedId: Meteor.user()._id, date: {$gte: currentDate}}).fetch().length;
    var totalTickets = Tickets.find({date: {$gte: currentDate}}).fetch().length; 
    
    if (totalTickets != 0) {
      return ((1 - assignedTickets/totalTickets) * 100).toFixed(0);
    }
    else {
      return 0;
    }

  },
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

