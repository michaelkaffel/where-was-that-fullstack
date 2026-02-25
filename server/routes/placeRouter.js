import express from 'express';
import multer from 'multer';
import path from 'path';
import Place from '../models/place.js';
import { verifyUser } from '../authenticate.js';
import { verifyPlaceOwner } from '../middleware.js';
import { corsMiddleware, corsWithOptions } from './cors.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const imageFileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files allowed'), false);
    }
    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 10 * 1240 * 1240,
        files: 1
    }
});


const placeRouter = express.Router();



placeRouter.route('/')
    .options(corsWithOptions, (req, res) => res.sendStatus(200))
    .get(corsWithOptions, verifyUser, async (req, res, next) => {
        try {
            const places = await Place.find({ owner: req.user._id })
                .populate('owner', 'username');

            res.status(200).json(places);
        } catch (err) {
            next(err);
        }
    })
    .post(
        corsWithOptions, 
        verifyUser,
        (req, res, next) => {
            upload.single('image')(req, res, function (err) {
                if (err instanceof multer.MulterError) {
                    if (err.code === 'LIMIT_FILE_SIZE') {
                        return res.status(400).json({
                            message: 'Image must be under 10MB'
                        });
                    }
                    return res.status(400).json({ message: err.message });
                } else if (err) {
                    return res.status(400).json({ message: err.message });
                }
                next();
            });
        },
        async (req, res, next) => {
            try {
                req.body.owner = req.user._id;

                if (req.file) {
                    req.body.imageUrl = `images/${req.file.filename}`;
                }

                const place = await Place.create(req.body);

                const populated = await Place.findById(place._id)
                    .populate('owner', 'username');

                res.status(201).json(populated);
            } catch (err) {
                next(err);
            }
        }
    )
    .put(corsMiddleware, (req, res) => {
        res.status(403).end('PUT operation not supported on /places');
    })
    .delete(corsMiddleware, (req, res) => {
        res.status(403).end('DELETE operation not supported');
    })

placeRouter.route('/:placeId')
    .options(corsWithOptions, (req, res) => res.sendStatus(200))
    .get(corsWithOptions, verifyUser, verifyPlaceOwner, async (req, res) => {
        const populated = await req.place.populate('owner', 'username');
        res.status(200).json(populated);
    })
    .post(corsMiddleware, (req, res) => {
        res.status(403).end(`POST operation not supported on /places/${req.params.placeId}`)
    })
    .put(corsMiddleware, (req, res) => {
        res.status(403).end(`PUT operation not supported on /places/${req.params.placeId}`)
    })
    .patch(corsWithOptions, verifyUser, verifyPlaceOwner, async (req, res, next) => {
        try {
            if (Object.keys(req.body).length !== 1 || typeof req.body.favorite !== 'boolean') {
                return res.status(400).json({ message: 'Only favorite boolean may be updated' });
            }

            req.place.favorite = req.body.favorite;

            const updated = await req.place.save();

            res.status(200).json(updated);
        } catch (err) {
            next(err);
        }
    })
    .delete(corsWithOptions, verifyUser, verifyPlaceOwner, async (req, res, next) => {
        try {
            await req.place.deleteOne();
            res.status(200).json({ message: 'Place deleted' });
        } catch (err) {
            next(err);
        }
    });

placeRouter.route('/:placeId/notes')
    .options(corsWithOptions, (req, res) => res.sendStatus(200))
    .get(corsWithOptions, verifyUser, verifyPlaceOwner, async (req, res, next) => {
        res.status(200).json(req.place.notes);
    })
    .post(corsWithOptions, verifyUser, verifyPlaceOwner, async (req, res, next) => {
        try {
            req.place.notes.push(req.body);
            const updated = await req.place.save();
            res.status(201).json(updated);
        } catch (err) {
            next(err);
        }
    })
    .put(corsMiddleware, (req, res) => {
        res.status(403).end(`PUT operation not supported on /places/${req.params.placeId}`)
    })
    .patch(corsMiddleware, (req, res) => {
        res.status(403).end(`PATCH operation not supported on /places/${req.params.placeId}`)
    })
    .delete(corsWithOptions, verifyUser, verifyPlaceOwner, async (req, res, next) => {
        try {
            req.place.notes = [];
            const updated = await req.place.save();
            res.status(200).json(updated);
        } catch (err) {
            next(err);
        }
    });

placeRouter.route('/:placeId/notes/:noteId')
    .options(corsWithOptions, (req, res) => res.sendStatus(200))
    .get(corsWithOptions, verifyUser, verifyPlaceOwner, async (req, res, next) => {
        const note = req.place.notes.id(req.params.noteId);

        if (!note) {
            const err = new Error('Note not found');
            err.status = 404;
            return next(err);
        }

        res.status(200).json(note);
    })
    .post(corsMiddleware, (req, res) => {
        res.status(403).end(`POST operation not supported on /places/${req.params.placeId}/notes/${req.params.noteId}`);
    })
    .put(corsMiddleware, (req, res) => {
        res.status(403).end(`PUT operation not supported on /places/${req.params.placeId}/notes/${req.params.noteId}`);
    })
    .patch(corsWithOptions, verifyUser, verifyPlaceOwner, async (req, res, next) => {
        try {
            const note = req.place.notes.id(req.params.noteId);

            if (!note) {
                const err = new Error('Note not found');
                err.status = 404;
                return next(err);
            }

            if (typeof req.body.text !== 'string' || req.body.text.trim() === '') {
                return res.status(400).json({ message: 'Text must be a non-empty string' });
            }

            note.text = req.body.text;
            const updated = await req.place.save();

            res.status(200).json(updated);

        } catch (err) {
            next(err);
        }
    })
    .delete(corsWithOptions, verifyUser, verifyPlaceOwner, async (req, res, next) => {
        try {
            const note = req.place.notes.id(req.params.noteId);

            if (!note) {
                const err = new Error('Note not found');
                err.status = 404;
                return next(err);
            }

            note.deleteOne();
            const updated = await req.place.save();
            res.status(200).json({ message: 'Note deleted' });
        } catch (err) {
            next(err);
        }
    });



export default placeRouter;