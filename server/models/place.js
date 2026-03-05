import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

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

const PLACE_TYPE = ['campsite', 'hike', 'overlook'];

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
        type: Date,
        required: true
    },
    favorite: {
        type: Boolean,
        required: true,
        default: false
    },
    kindOfPlace: {
        type: String,
        required: true,
        enum: PLACE_TYPE
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

placeSchema.index({ owner: 1 });
placeSchema.index({ kindOfPlace: 1 });
placeSchema.index({ owner: 1, kindOfPlace: 1 });
placeSchema.index({ title: 'text', description: 'text'})

placeSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
        try {
            if (this.imageUrl) {
                try {
                    const filename = path.basename(this.imageUrl);
                    const imagePath = path.join(
                        process.cwd(),
                        'public',
                        'images',
                        filename
                    );

                    fs.unlinkSync(imagePath);
                } catch (err) {
                    console.log('Image delete error:', err.message);
                }
            }
            next()
        } catch (err) {
            next(err);
        }
    }
);

const Place = mongoose.model('Place', placeSchema);

export default Place;