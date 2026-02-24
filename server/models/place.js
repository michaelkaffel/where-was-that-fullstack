import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const notesSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const placeSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    dateVisited: {
        type: String,
        required: true
    },
    favorite: {
        type: Boolean,
        required: true,
        default: false
    },
    kindOfPlace: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    notes: [notesSchema]
}, {
    timestamps: true
});

const Place = mongoose.model('Place', placeSchema);

export default Place;