// Tracker
Tracker.autorun(function() {
    Meteor.subscribe('userEmailAccounts');
    Meteor.subscribe('userDomains');
    Meteor.subscribe('userTickets');
    Meteor.subscribe('userChats');
    Meteor.subscribe('userData');
    Meteor.subscribe('allUsers');
    Meteor.subscribe('userRatings');
    Meteor.subscribe('userConnections');
    Meteor.subscribe('userMessages');
    Meteor.subscribe('userTemplates');
    Meteor.subscribe('userRules');
    Meteor.subscribe('userIntegrations');
});

// Imports
import 'bootstrap';
import '/node_modules/bootstrap/dist/css/bootstrap.min.css';

const Spinner = require('spin');