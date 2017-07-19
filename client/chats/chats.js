Template.chats.helpers({

    chats: function() {
        return Chats.find({})
    },
    connections: function() {
        return Connections.find({});
    }

});
