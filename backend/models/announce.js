const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    audience: {
        type: String,
        enum: ['All', 'Tutors', 'Students'],
        default: 'All'
    }
}, { timestamps: true });
module.exports = mongoose.models.Announcement || mongoose.model('Announcement', announcementSchema);

