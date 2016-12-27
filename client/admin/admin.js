Template.admin.helpers({

    tickets: function() {

        if (Session.get('operator')) {

            if (Session.get('operator') == 'all') {
                return Tickets.find({}, { sort: { date: -1 } });
            } else {
                return Tickets.find({ assignedId: Session.get('operator') }, { sort: { date: -1 } });
            }

        } else {
            return Tickets.find({}, { sort: { date: -1 } });
        }

    },
    users: function() {
        return Meteor.users.find({});
    },

});

Template.admin.events({

    'click #set-operator': function() {
        Session.set('operator', $('#operator :selected').val());
    }

});
