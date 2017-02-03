Template.chatDetails.helpers({

    messages: function() {
        return Messages.find({ chatId: this._id })
    },
    domainName: function() {
        return Domains.findOne(this.domainId).url;
    }

});

Template.chatDetails.events({

    'click #reply-chat': function() {

        // Reply
        messageBody = $('#message-text').summernote('code');
        Meteor.call('replyChat', messageBody, this._id);

    }

});

Template.chatDetails.onRendered(function() {

    // Message
    $('#message-text').summernote({
        height: 100
    });

});
