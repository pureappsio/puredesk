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

    'click #link-integration': function() {

        var integrationId = $('#integration-id :selected').val();
        var domainId = $('#domain-id :selected').val();

        Meteor.call('linkIntegration', integrationId, domainId);

    },
    'click #add-integration': function() {

        var accountData = {
            type: $('#integration-type :selected').val(),
            key: $('#integration-key').val(),
            url: $('#integration-url').val(),
            userId: Meteor.user()._id
        };
        Meteor.call('addIntegration', accountData);

    },

    'click #send-summary': function() {

        Meteor.call('sendSummaryEmail');

    },
    'click #restrict-user': function() {

        Meteor.call('restrictUser', $('#restrict-user-id :selected').val(), $('#restrict-domains').val());

    },
    'click #generate-key': function() {

        Meteor.call('generateApiKey');

    },
    'click #set-from-name': function() {

        Meteor.call('setFromName', $('#from-name').val());

    },
    'click #set-role': function() {

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
    },
    'click #add-rule': function() {

        rule = {
            userId: Meteor.user()._id,
            emailId: $('#forward-email').val(),
            forwardId: $('#forward-user').val()
        }

        Meteor.call('addRule', rule);
    }

});

Template.settings.helpers({

    // responseTime: function() {

    //     // Limit date
    //     var date = new Date();
    //     var limitDate = new Date(date.getTime() - 30 * 24 * 60 * 60 * 1000);

    //     // Get all tickets
    //     var tickets = Tickets.find({ date: { $gte: limitDate } }).fetch();
    //     var intervals = [];

    //     for (i in tickets) {

    //         // Get all messages
    //         var messages = Messages.find({ ticketId: tickets[i]._id }, { sort: { date: 1 } }).fetch();

    //         for (m in messages) {

    //             if (messages[m + 1]) {

    //                 // if (messages[m + 1].senderId && messages[m].sender) {
    //                     var interval = (messages[m + 1].date).getTime() - (messages[m].date).getTime();
    //                     intervals.push(interval);
    //                 // }

    //             }
    //         }

    //     }

    //     console.log(intervals);

    //     // Calculate average
    //     average = 0;
    //     for (i in intervals) {
    //         average += intervals[i];
    //     }
    //     average = average / intervals.length;

    //     return (average / 1000 / 60 / 60).toFixed(0) + ' hours';

    // },
    transferRate: function() {

        // Get date
        var currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 30);

        // Return
        var assignedTickets = Tickets.find({ assignedId: Meteor.user()._id, date: { $gte: currentDate } }).fetch().length;
        var totalTickets = Tickets.find({ date: { $gte: currentDate } }).fetch().length;

        if (totalTickets != 0) {
            return ((1 - assignedTickets / totalTickets) * 100).toFixed(0);
        } else {
            return 0;
        }

    },
    domains: function() {
        return Domains.find({});
    },
    rules: function() {
        return Rules.find({});
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
    },
    integrations: function() {
        return Integrations.find({});
    }

});
