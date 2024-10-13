const Chat = require("../Models/chat");
const Message = require("../Models/message");

async function get_conversation_by_id(req, res, next) {
    const id = req.body.id;

    try {
        const user = req.user;
        let conversation = await Chat.findOne({
            _id: id,
            participants: { $in: [user._id] }
        }).populate('participants', 'name email mobile avatar');

        if (conversation) {
            const receiver = conversation.participants.find(participant => !participant._id.equals(user._id));
            const sender = conversation.participants.find(participant => participant._id.equals(user._id));

            conversation = conversation.toObject();
            conversation.receiver = receiver;
            conversation.sender = sender;
            conversation.participants = undefined;
            return res.json(conversation)
        } else {
            return res.json({ message: "No conversation found" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while finding the conversation.' });

    }

}

async function get_messages_by_conversation_id(req, res, next) {
    try {
        const id = req?.body?.id;
        console.log(("okey" + id))
        const messages = await Message.find({ ChatId: id }).populate('sender', 'name email mobile avatar');

        return res.json(messages)

    } catch (error) {
        res.status(500).json({ message: 'An error occurred while finding the messages.' });

    }




}

async function sendMessage(req, res, next) {

    const newChat = req.body.newChat;
    const { message } = newChat;

}



async function delete_chat(req, res, next) {
    const { id } = req.query;
    console.log(id, "delete this");

    try {
        const user = req.user;
        const chat = await Chat.findOneAndDelete({
            _id: id,
            participants: { $in: [user._id] }
        });
        if (chat) {
            await Message.deleteMany({ ChatId: id });



            return res.json({ message: "Chat deleted successfully", id: id })



        } else {
            return res.status(404).json({ message: "No chat found" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while deleting the chat.' });

    }
}






module.exports = { get_conversation_by_id, get_messages_by_conversation_id, sendMessage, delete_chat }