Template.tickets.helpers({

    tickets: function() {

        var user = Meteor.user();

        var cutDate = new Date();
        cutDate = new Date(cutDate.getTime() - 14 * 24 * 3600 * 1000);

        console.log(Tickets.find({}).fetch());

        if (Session.get('tickets')) {

            var type = Session.get('tickets');

            if (user.domains) {

                if (type == 'all') {
                    return Tickets.find({ domainId: { $in: user.domains }, status: 'open', assignedId: Meteor.user()._id }, { sort: { lastReplyDate: -1 } });
                }
                if (type == 'opened') {
                    return Tickets.find({ domainId: { $in: user.domains }, status: 'open', assignedId: { $exists: false } }, { sort: { lastReplyDate: -1 } });
                }
                if (type == 'active') {
                    return Tickets.find({ domainId: { $in: user.domains }, status: { $in: ['open', 'pending'] } }, { sort: { lastReplyDate: -1 } });
                }
                if (type == 'closed') {
                    return Tickets.find({
                        domainId: { $in: user.domains },
                        status: { $in: ['closed', 'spam'] }
                    }, { sort: { lastReplyDate: -1 }, limit: 100 });
                }

            } else {

                if (type == 'all') {
                    return Tickets.find({ status: 'open', assignedId: Meteor.user()._id }, { sort: { lastReplyDate: -1 } });
                }
                if (type == 'opened') {
                    return Tickets.find({ status: 'open', assignedId: { $exists: false } }, { sort: { lastReplyDate: -1 } });
                }
                if (type == 'active') {
                    return Tickets.find({ status: { $in: ['open', 'pending'] } }, { sort: { lastReplyDate: -1 } });
                }
                if (type == 'closed') {
                    return Tickets.find({ status: { $in: ['closed', 'spam'] } }, { sort: { lastReplyDate: -1 }, limit: 100 });
                }

            }

        } else {
            if (user.domains) {
                return Tickets.find({ domainId: { $in: user.domains }, status: 'open', assignedId: { $exists: false } }, { sort: { lastReplyDate: -1 } });

            } else {
                return Tickets.find({ status: 'open', assignedId: { $exists: false } }, { sort: { lastReplyDate: -1 } });
            }
        }

    },
    allTickets: function() {
        var user = Meteor.user();
        if (user.domains) {
            return Tickets.find({ domainId: { $in: user.domains }, status: 'open', assignedId: Meteor.user()._id }, { sort: { lastReplyDate: -1 } }).fetch().length;

        } else {
            return Tickets.find({ status: 'open', assignedId: Meteor.user()._id }, { sort: { lastReplyDate: -1 } }).fetch().length;

        }
    },
    activeTickets: function() {
        var user = Meteor.user();
        if (user.domains) {
            return Tickets.find({ domainId: { $in: user.domains }, status: { $in: ['open', 'pending'] } }, { sort: { lastReplyDate: -1 } }).fetch().length;

        } else {
            return Tickets.find({ status: { $in: ['open', 'pending'] } }, { sort: { lastReplyDate: -1 } }).fetch().length;

        }
    },
    closedTickets: function() {
        var user = Meteor.user();
        if (user.domains) {
            return Tickets.find({ domainId: { $in: user.domains }, status: { $in: ['closed', 'spam'] } }, { sort: { lastReplyDate: -1 } }).fetch().length;

        } else {
            return Tickets.find({ status: { $in: ['closed', 'spam'] } }, { sort: { lastReplyDate: -1 }, limit: 100 }).fetch().length;

        }
    },
    openedTickets: function() {
        var user = Meteor.user();
        if (user.domains) {
            return Tickets.find({ domainId: { $in: user.domains }, status: 'open', assignedId: { $exists: false } }, { sort: { lastReplyDate: -1 } }).fetch().length;

        } else {
            return Tickets.find({ status: 'open', assignedId: { $exists: false } }, { sort: { lastReplyDate: -1 } }).fetch().length;
        }
    }

});

Template.tickets.events({

    'click #set-all': function() {

        Session.set('tickets', 'all');

    },
    'click #set-closed': function() {

        Session.set('tickets', 'closed');

    },
    'click #set-opened': function() {

        Session.set('tickets', 'opened');

    },
    'click #set-active': function() {

        Session.set('tickets', 'active');

    }

});
