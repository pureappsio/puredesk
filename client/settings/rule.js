Template.rule.helpers({

    email: function() {
        return EmailAccounts.findOne(this.emailId).email;
    },
    user: function() {
        return Meteor.users.findOne(this.forwardId).fromName;
    }

});
