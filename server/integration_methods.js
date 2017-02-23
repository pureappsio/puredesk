Meteor.methods({

    getIntegrations: function() {

        return Integrations.find({}).fetch();

    },
    addIntegration: function(data) {

        // Insert
        Integrations.insert(data);

    },
    removeIntegration: function(data) {

        // Insert
        Integrations.remove(data);

    },
    linkIntegration(integrationId, domainId) {

        console.log(integrationId);

        Integrations.update(integrationId, { $set: { domainId: domainId } });

        console.log( Integrations.findOne(integrationId));


    }
});
