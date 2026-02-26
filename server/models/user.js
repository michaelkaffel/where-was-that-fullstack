import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import Place from './place.js';
import fs from 'fs';
import path from 'path';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    googleId: String,
    admin: {
        type: Boolean,
        default: false
    }
});

userSchema.plugin(passportLocalMongoose);

userSchema.pre(
    'deleteOne', {
        document: true,
        query: false
    },
    async function (next) {
        try {
            const places = await Place.find({ owner: this._id});

            for (const place of places) {
                if (place.imageUrl) {
                    try {
                        const imagePath = path.join(
                            process.cwd(),
                            'public',
                            place.imageUrl
                        );
                        fs.unlinkSync(imagePath);
                    } catch (err) {
                        console.log('Image delete error:', err.message);
                    }
                }
                await place.deleteOne();
            }
            next();
        } catch (err) {
            next(err);
        }
    }
);

const User = mongoose.model('User', userSchema)

export default User;