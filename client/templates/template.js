Template.template.events({

    'click .delete-template': function() {
        Meteor.call('removeTemplate', this._id);
    }

});