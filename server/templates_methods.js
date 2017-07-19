Meteor.methods({

    createTemplate: function(template) {

        console.log(template);
        Templates.insert(template);

    },
    removeTemplate: function(templateId) {
        Templates.remove(templateId);
    },
    loadTemplate: function(templateId) {
    	return Templates.findOne(templateId).content;
    }

});
