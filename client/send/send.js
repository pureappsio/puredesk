Template.send.events({

    'click #send-email': function() {

        email = {
            userId: Meteor.user()._id,
            from: $('#email-from').val(),
            accountId: $('#account-id :selected').val(),
            to: $('#email-to').val(),
            subject: $('#email-subject').val(),
            text: CKEDITOR.instances['email-text'].getData()
        }

        Meteor.call('sendEmail', email);
    }

});

Template.send.helpers({

    emailAccounts: function() {
        return EmailAccounts.find({});
    }

});

Template.send.onRendered(function() {

    CKEDITOR.replace('email-text');

});
