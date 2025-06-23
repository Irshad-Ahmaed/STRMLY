const mongoose = require('mongoose')

const videoSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title:{
        type: String,
        required: true,
        trim: true,
    },
    description:{
        type: String,
        required: true,
        trim: true,
    },
    videoUrl:{
        type: String,
        required: true,
        unique: true
    },
},
{
    timestamps: true
}
);

module.exports = mongoose.model('Video', videoSchema);