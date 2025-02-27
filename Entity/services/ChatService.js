const Chat = require('../Chat'); // Adjust path if needed
const Message = require('../Message'); // Ensure correct path
exports.createChat = async (chatId) => {
    try {
        const existingChat = await Chat.findOne({ chatId });
        if (existingChat) {
            console.log('Chat already exists:', existingChat);
            return existingChat;
        }
        const newChat = new Chat({ chatId }); // chat1 and chat2 will default to empty lists
        await newChat.save();
        console.log('Chat created successfully:', newChat);
        return newChat;
    } catch (error) {
        console.error('Error creating chat:', error);
    }
};


exports.addToChat = async (chatId, messageData, roomId, socketId) => {
    try {
        // Create and save the new message
        const newMessage = new Message(messageData);
        await newMessage.save();

        // Determine which field to update
        const fieldToUpdate = roomId > socketId ? "chat1" : "chat2";
        const updateQuery = { $push: { [fieldToUpdate]: newMessage._id } };

        // Update the chat document by pushing the new message reference
        const updatedChat = await Chat.findOneAndUpdate(
            { chatId: chatId }, // Find chat by chatId
            updateQuery, // Append the new message ID
            { new: true, upsert: true } // Return the updated document, create if not exists
        ).populate(fieldToUpdate); 

        console.log("Updated Chat:", updatedChat);
    } catch (err) {
        console.error("Error updating chat:", err);
    }
};




