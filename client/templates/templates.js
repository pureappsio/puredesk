Template.templates.helpers({

    domains: function() {
        return Domains.find({});
    },
    templates: function() {
        return Templates.find({});
    }

});

Template.templates.events({

    'click #add-template': function() {

        var template = {
            userId: Meteor.user()._id,
            title: $('#title').val(),
            content: CKEDITOR.instances['template-text'].getData(),
            domain: $('#brand :selected').val()
        }

        Meteor.call('createTemplate', template);

    }

});

Template.templates.onRendered(function() {

    // Init
    CKEDITOR.replace('template-text');

});
