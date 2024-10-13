const Chat = require("../Models/chat");
const People = require("../Models/peopleSchema");



function getInbox(req, res, next) {


    res.render('inbox', { title: 'Inbox', ...req.user })

}





async function create_chats(req, res, next) {



    try {
        const { search_user_1 } = req.body;


        const search_user_2 = req.user.email
        // Validate input
        if (!search_user_1 && !search_user_2) {
            return res.status(400).json({ message: 'Please provide a username or mobile number to search.' });
        }


        // Find users based on input
        const user1 = search_user_1 ? await People.findOne({
            _id: search_user_1
        }) : null;
        const user2 = search_user_2 ? await People.findOne({
            $or: [
                { email: search_user_2 },
                { mobile: search_user_2 }
            ]
        }) : null;

        if (!user1 && !user2) {
            return res.status(404).json({ message: 'No users found with the provided information.' });
        }

        // Check if a chat already exists between the users
        const existingChat = await Chat.findOne({
            participants: { $all: [user1 ? user1._id : null, user2 ? user2._id : null].filter(Boolean) }
        });

        if (existingChat) {
            return res.status(400).json({ message: 'A conversation between these users already exists.' });
        }

        // Create a new chat
        const chat = new Chat({
            participants: [user1 ? user1._id : null, user2 ? user2._id : null].filter(Boolean)
        });

        // Add the chat to each user's conversations
        if (user1) {
            user1.conversations.push(chat._id);
            await user1.save();
        }
        if (user2) {
            user2.conversations.push(chat._id);
            await user2.save();
        }

        await chat.save();

        res.status(201).json({ message: 'Chat created successfully!', chat });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while creating the chat.' });
    }
}


async function find_match_users(req, res, next) {
    const { search_user_text } = req.body;
    console.log(search_user_text, "search_user_text");
    try {
        const users = await People.find({
            $or:
                [
                    { name: { $regex: search_user_text, $options: 'i' } },
                    { email: { $regex: search_user_text, $options: 'i' } },
                    { mobile: { $regex: search_user_text, $options: 'i' } }

                ]
        }).select('name email mobile avatar role _id').withoutMe(req.user._id);

        if (users && users?.length > 0) {
            return res.json({ users })
        } else {
            return res.json({ message: "No users found" })
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while finding the users.' });

    }


}



async function get_Conversation_list(req, res, next) {
    try {
        const user = req.user;
        const conversations = await Chat.find({
            participants: { $in: [user._id] }
        }).populate('participants', 'name email mobile avatar');

        const newCon = conversations.map(conversation => {
            const receiver = conversation.participants.find(participant => !participant._id.equals(user._id));
            const sender = conversation.participants.find(participant => participant._id.equals(user._id));


            conversation = conversation.toObject();
            conversation.receiver = receiver;
            conversation.sender = sender;
            conversation.participants = undefined;
            return conversation


        });



        res.send(newCon);
    } catch (error) {
        next(error);
    }
}






module.exports = { getInbox, create_chats, find_match_users, get_Conversation_list }
