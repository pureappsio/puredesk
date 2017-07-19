Template.ticketDetails.helpers({

    messages: function() {
        return Messages.find({ ticketId: this._id });
    },
    accountEmail: function() {
        return EmailAccounts.findOne(this.accountId).email;
    },
    accountName: function() {
        return EmailAccounts.findOne(this.accountId).email;
    },
    assignedName: function() {
        if (this.assignedId) {
            return Meteor.users.findOne(this.assignedId).fromName;
        } else {
            return 'Not assigned';
        }

    },
    users: function() {
        return Meteor.users.find({});
    },
    products: function() {
        return Session.get('products');
    },
    templates: function() {
        return Templates.find({});
    }

});

Template.ticketDetails.events({

    'click #load-template': function() {

        // Get template value
        Meteor.call('loadTemplate', $('#template-select :selected').val(), function(err, data) {
            CKEDITOR.instances['email-text'].setData(data);
        });

    },
    'click #reply-ticket': function() {

        // Reply
        messageBody = CKEDITOR.instances['email-text'].getData();
        Meteor.call('replyTicket', messageBody, this._id, function(err, data) {
            CKEDITOR.instances['email-text'].setData('');
        });

    },
    'click #reply-ticket-mobile': function() {

        // Reply
        messageBody = CKEDITOR.instances['email-text'].getData();
        Meteor.call('replyTicket', messageBody, this._id, function(err, data) {
            CKEDITOR.instances['email-text'].setData('');
        });

    },
    'click #mark-closed': function() {

        // Reply
        Meteor.call('closeTicket', this._id);

    },
    'click #mark-spam': function() {

        // Reply
        Meteor.call('spamTicket', this._id);

    },
    'click #assign': function() {

        // Reply
        Meteor.call('assignTicket', this._id, $('#assigned-id :selected').val());

    }

});

Template.ticketDetails.onRendered(function() {

    // Message
    // $('#email-text').summernote({
    //     height: 150
    // });

    // Init
    CKEDITOR.replace('email-text', {
        extraPlugins: 'autolink',
        removePlugins: 'toolbar'
    });

    if (Meteor.user()) {

        if (Meteor.user().fromName) {
            message = '<p></p><p>Cheers, </br>' + Meteor.user().fromName + '</p>';
            CKEDITOR.instances['email-text'].setData(message);
        }

    }

    if (this.data) {
        Meteor.call('getProducts', this.data.domainId, function(err, products) {

            Session.set('products', products);

        });
    }


});
