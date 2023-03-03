import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
        unique: true,
    },
    tags: {
        type: Array,
        default: [],
    },
    views: {
        type: Number,
        default: 0,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    comments: [{
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        text: {
            type: String,
            required: true
        }
    }],
    image: String
}, {
    timestamps: true
})
export default mongoose.model('Post', PostSchema);