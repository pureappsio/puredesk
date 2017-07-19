Meteor.publish("userEmailAccounts", function() {
    return EmailAccounts.find({});
});

Meteor.publish("userDomains", function() {
    return Domains.find({});
});

Meteor.publish("userTickets", function() {
    return Tickets.find({});
});

Meteor.publish("userRules", function() {
    return Rules.find({});
});

Meteor.publish("userMessages", function() {
    return Messages.find({});
});

Meteor.publish("userConnections", function() {
    return Connections.find({});
});


Meteor.publish("userChats", function() {
    return Chats.find({});
});

Meteor.publish("userRatings", function() {
    return Ratings.find({});
});

Meteor.publish("allUsers", function() {
    return Meteor.users.find({});
});

Meteor.publish("userTemplates", function() {
    return Templates.find({});
});

Meteor.publish("userIntegrations", function() {
    return Integrations.find({});
});

Meteor.publish("userData", function() {
    return Meteor.users.find({ _id: this.userId }, { services: 1 });
});
