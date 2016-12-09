Template.send.events({

  'click #send-email': function() {

    email = {
      userId: Meteor.user()._id,
      from: $('#email-from').val(),
      accountId: $('#account-id :selected').val(),
      to: $('#email-to').val(),
      subject: $('#email-subject').val(),
      text: $('#email-text').summernote('code')
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

	$('#email-text').summernote({
      height: 300
    });

});