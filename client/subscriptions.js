// Tracker
Tracker.autorun(function() {
    Meteor.subscribe('userEmailAccounts');
    Meteor.subscribe('userDomains');
    Meteor.subscribe('userTickets');
    Meteor.subscribe('userData');
    Meteor.subscribe('allUsers');
    Meteor.subscribe('userMessages');
});