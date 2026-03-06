import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import Place from './place.js';
import fs from 'fs';
import path from 'path';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        // lowercase: true,
        // trim: true
    },
    firstname: {
        type: String,
        default: '',
        required: true
    },
    lastname: {
        type: String,
        default: '',
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    googleId: {
        type: String,
        index: true
    },
    admin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

userSchema.plugin(passportLocalMongoose);

const transform = (doc, ret) => {

    ret.id = ret._id.toString();

    delete ret._id;
    delete ret.__v;
    delete ret.hash;
    delete ret.salt;

    return ret
};

userSchema.set('toJSON', { transform });
userSchema.set('toObject', { transform });

userSchema.index({ email: 1 }, { unique: true });



userSchema.pre(
    'deleteOne', {
    document: true,
    query: false
},
    async function (next) {
        try {
            const places = await Place.find({ owner: this._id });

            for (const place of places) {
                if (place.imageUrl) {
                    try {
                        const filename = path.basename(place.imageUrl);

                        const imagePath = path.join(
                            process.cwd(),
                            'public',
                            'images',
                            filename
                        );
                        fs.unlinkSync(imagePath);
                    } catch (err) {
                        if (err.code !== 'ENOENT') console.log('IMage delete error', err.message)
                    }
                }
                place.imahgeUrl = null;
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