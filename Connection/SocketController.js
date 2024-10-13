const { set } = require("mongoose");
const checkLogin = require("../middlewares/common/checkLogin");
const jwt = require('jsonwebtoken');
const Message = require("../Models/message");




const SocketController = (socket, io) => {

    console.log('A user connected:', socket.id);

    // Join the room for a specific chat ID
    socket.on('join-room', (chatId) => {
        console.log(`User joined room: ${chatId}`);
        socket.join(chatId);
    });

    // Listen for incoming messages
    socket.on('send-message', async (messageData) => {
        const { message, chatId, senderId, receiverId, avatar } = messageData;
        console.log("avatar", avatar)
        // Save message to DB
        const newMessage = new Message({
            ChatId: chatId,
            sender: senderId,
            receiver: receiverId,
            message: message,
            avatar: avatar,
            timeNow: new Date().toLocaleString() 

        });


        // Emit the message to the specific room
        io.to(chatId).emit('receive-message', newMessage);


        try {
            await newMessage.save();

        } catch (error) {
            console.error("Error saving message:", error);
        }

    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });






}

module.exports = SocketController;