Template.ticket.helpers({

    accountEmail: function() {
        return EmailAccounts.findOne(this.accountId).email;
    },
    assignedName: function() {
        if (this.assignedId) {
            return 'Assigned to ' + Meteor.users.findOne(this.assignedId).fromName;
        } else {
            return 'Not assigned'
        }
    },
    lastReplyColor: function() {

        var messages = Messages.find({ ticketId: this._id, sender: { $exists: true } }, { sort: { date: -1 } }).fetch();
        var lastReplyDate = (messages[0].date).getTime();
        var currentDate = (new Date()).getTime();

        if ((currentDate - lastReplyDate) > 2 * 24 * 3600 * 1000) {
            return 'danger';
        } else if ((currentDate - lastReplyDate) > 24 * 3600 * 1000) {
            return 'warning';
        } else {
            return 'success';
        }

    },
    lastReplyDate: function() {
        var messages = Messages.find({ ticketId: this._id, sender: { $exists: true } }, { sort: { date: -1 } }).fetch();
        return moment(messages[0].date).fromNow();
    }

});

Template.ticket.events({

    'click .ticket-mobile-container': function() {

        Router.go('/tickets/' + this._id);

    },
    'click .delete-ticket': function() {
        Meteor.call('deleteTicket', this._id);
    }

});
