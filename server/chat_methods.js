Meteor.methods({

    replyChat: function(messageBody, chatId) {

        // Get email account
        var chat = Chats.findOne(chatId);

        // Create new message
        var message = {
            chatId: chat._id,
            content: messageBody,
            userId: Meteor.user()._id,
            date: new Date(),
            sender: 'operator'
        }
        console.log(message);
        Messages.insert(message);

        // Update ticket
        Chats.update(chatId, { $set: { status: 'live' } });

    },
    startChat: function(data, user) {

        // Find domain
        var domain = Domains.findOne({ url: data.domain });

        if (data.chatId) {

            // Ticket
            var chat = Chats.findOne(data.chatId);

            // Update
            Chats.update(chat._id, { $set: { status: 'live' } });

            // Add new message
            var message = {
                chatId: chat._id,
                content: data.message,
                userId: user._id,
                date: new Date(),
                domainId: domain._id,
                sender: 'client'

            }

            Messages.insert(message);

            return chat._id;

        } else {

            // Inserr
            var chat = {
                domainId: domain._id,
                userId: user._id,
                date: new Date(),
                status: 'live'
            }

            var chatId = Chats.insert(chat);

            // Create first message
            var message = {
                chatId: chatId,
                content: data.message,
                userId: user._id,
                date: new Date(),
                domainId: domain._id,
                sender: 'client'
            }
            console.log(message);
            Messages.insert(message);

            return chatId;
        }



    },

    deleteChat: function(chatId) {

        Chats.remove(chatId);

    }

});
