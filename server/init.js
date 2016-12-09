Meteor.startup(function() {

    // Mail URL
    process.env.MAIL_URL = Meteor.settings.MAIL_URL;

    // Start cron jobs
    SyncedCron.start();

    // Create users
    Meteor.call('createUsers');

});
