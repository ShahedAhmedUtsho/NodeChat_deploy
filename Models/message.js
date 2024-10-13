const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
    ChatId: {
        type: Schema.Types.ObjectId,
        ref: 'Chat', // Reference to a Conversation model
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'People', // Reference to the User model
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'People', // Reference to the User model
        required: true
    },
    message: {
        type: String,
        required: true
    },
    timeNow: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
        required: true
    },
    attachments: [{
        fileUrl: String, // URL of the attachment
        fileType: String // Type of file (image, video, etc.)
    }]
}, { timestamps: true }); // Adds createdAt and updatedAt fields



messageSchema.query.newFirst = function () {
    return this.sort({ createdAt: -1 }); // Make sure to return the query
};








const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
