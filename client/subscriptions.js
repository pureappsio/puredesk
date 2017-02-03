// Tracker
Tracker.autorun(function() {
    Meteor.subscribe('userEmailAccounts');
    Meteor.subscribe('userDomains');
    Meteor.subscribe('userTickets');
    Meteor.subscribe('userChats');
    Meteor.subscribe('userData');
    Meteor.subscribe('allUsers');
    Meteor.subscribe('userRatings');
    Meteor.subscribe('userMessages');
    Meteor.subscribe('userIntegrations');
});