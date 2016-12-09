Meteor.publish("userEmailAccounts", function () {
	return EmailAccounts.find();
});

Meteor.publish("userDomains", function () {
	return Domains.find();
});

Meteor.publish("userTickets", function () {
	return Tickets.find();
});

Meteor.publish("userMessages", function () {
	return Messages.find();
});

Meteor.publish("allUsers", function () {
	return Meteor.users.find({});
});

Meteor.publish("userData", function () {
  return Meteor.users.find({_id: this.userId}, {services: 1});
});