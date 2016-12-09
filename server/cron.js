SyncedCron.add({
  name: 'Automatically close old tickets',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('every 1 day');
  },
  job: function() {
    Meteor.call('closeOldTickets');
  }
});