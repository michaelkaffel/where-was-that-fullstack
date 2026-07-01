import express from 'express';
import { uploadToGCS } from '../gcs.js';
import multer from 'multer';
import path from 'path';
import Place from '../models/place.js';
import { verifyUser } from '../authenticate.js';
import { loadPlace, loadPlaces, verifyPlaceOwner } from '../middleware.js';
import { corsMiddleware, corsWithOptions } from './cors.js';
import { Readable } from 'stream';


const restoreRawBody = (req, res, next) => {
    if (req.rawBody) {
        const readable = new Readable();
        readable.push(req.rawBody);
        readable.push(null);
        readable.headers = req.headers;
        readable.method = req.method;
        readable.url = req.url;

        upload.single('image')(readable, res, (err) => {
            if (readable.file) req.file = readable.file;
            if (readable.body) req.body = readable.body;
            if (err) return next(err);
            next();
        });
    } else {
        upload.single('image')(req, res, next);
    }
};

const storage = multer.memoryStorage();

const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

const imageFileFilter = (req, file, cb) => {

    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowedExtensions.includes(ext)) {
        return cb(new Error('Invalid file extension'), false);
    }

    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Only JPG, PNG, and WEBP images allowed'), false);
    }
    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 1
    }
});


const placeRouter = express.Router();



placeRouter.route('/')
    .options(corsWithOptions, (req, res) => res.sendStatus(200))
    .get(corsWithOptions, verifyUser, loadPlaces, async (req, res, next) => {
        try {
            res.api(req.places);
        } catch (err) {
            next(err)
        }
    })
    .post(
        corsWithOptions,
        verifyUser,
        (req, res, next) => {
            restoreRawBody(req, res, (err) => {
                if (err instanceof multer.MulterError) {
                    if (err.code === 'LIMIT_FILE_SIZE') {
                        return res.status(400).json({ message: 'Image must be under 10MB' });
                    }
                    return res.status(400).json({ message: err.message });
                } else if (err) {
                    console.error('[POST /places] restoreRawBody/multer error:', {
                        message: err.message,
                        stack: err.stack,
                        contentType: req.headers['content-type'],
                        contentLength: req.headers['content-length'],
                    });
                    return res.status(400).json({ message: err.message });
                }

                // Diagnostic: flag if a multipart request came through without a file/body
                // restored — points at hypotheses 1/2 (restoreRawBody not firing correctly)
                const isMultipart = req.headers['content-type']?.includes('multipart/form-data');
                if (isMultipart && !req.file && Object.keys(req.body || {}).length === 0) {
                    console.warn('[POST /places] multipart request but no file/body restored', {
                        hasRawBody: !!req.rawBody,
                        rawBodyLength: req.rawBody?.length,
                        contentLength: req.headers['content-length'],
                    });
                }

                next();
            });
        },
        async (req, res, next) => {
            try {
                req.body.owner = req.user._id;

                if (req.file) {
                    req.body.imageUrl = await uploadToGCS(
                        req.file.buffer,
                        req.file.originalname,
                        req.file.mimetype
                    );
                }

                const place = await Place.create(req.body);

                const populated = await Place.findById(place._id)
                    .populate('owner', 'username');

                res.api(populated, 201);
            } catch (err) {
                // Classify known Mongoose failure modes instead of a blind 500
                if (err.name === 'ValidationError') {
                    console.error('[POST /places] validation error:', {
                        message: err.message,
                        errors: err.errors,
                        bodyKeys: Object.keys(req.body || {}),
                    });
                    return res.status(400).json({ message: err.message });
                }

                if (err.code === 11000) {
                    console.error('[POST /places] duplicate key error:', {
                        keyValue: err.keyValue,
                    });
                    return res.status(409).json({ message: 'A place with that title already exists' });
                }

                // Genuinely unexpected failure — full context for Cloud Logging
                console.error('[POST /places] unhandled error:', {
                    message: err.message,
                    stack: err.stack,
                    name: err.name,
                    hasFile: !!req.file,
                    bodyKeys: Object.keys(req.body || {}),
                    contentType: req.headers['content-type'],
                    contentLength: req.headers['content-length'],
                    userAgent: req.headers['user-agent'],
                });

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
    .get(corsWithOptions, verifyUser, loadPlace, verifyPlaceOwner, async (req, res, next) => {
        try {
            res.api(req.place);
        } catch (err) {
            next(err)
        }

    })
    .post(corsMiddleware, (req, res) => {
        res.status(403).end(`POST operation not supported on /places/${req.params.placeId}`)
    })
    .put(corsMiddleware, (req, res) => {
        res.status(403).end(`PUT operation not supported on /places/${req.params.placeId}`)
    })
    .patch(corsWithOptions, verifyUser, loadPlace, verifyPlaceOwner, async (req, res, next) => {
        try {
            if (Object.keys(req.body).length !== 1 || typeof req.body.favorite !== 'boolean') {
                return res.status(400).json({ message: 'Only favorite boolean may be updated' });
            }

            req.place.favorite = req.body.favorite;

            const updated = await req.place.save();

            res.api(updated);
        } catch (err) {
            next(err);
        }
    })
    .delete(corsWithOptions, verifyUser, loadPlace, verifyPlaceOwner, async (req, res, next) => {
        try {
            await req.place.deleteOne();
            res.status(200).json({ message: 'Place deleted' });
        } catch (err) {
            next(err);
        }
    });

placeRouter.route('/:placeId/notes')
    .options(corsWithOptions, (req, res) => res.sendStatus(200))
    .get(corsWithOptions, verifyUser, loadPlace, verifyPlaceOwner, async (req, res, next) => {

        try {
            res.status(200).json(req.place.toJSON().notes);
        } catch (err) {
            next(err);
        }

    })
    .post(corsWithOptions, verifyUser, loadPlace, verifyPlaceOwner, async (req, res, next) => {
        try {
            req.place.notes.push(req.body);
            const updated = await req.place.save();
            res.api(updated);
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
    .delete(corsWithOptions, verifyUser, loadPlace, verifyPlaceOwner, async (req, res, next) => {
        try {
            req.place.notes = [];
            const updated = await req.place.save();
            res.api(updated);
        } catch (err) {
            next(err);
        }
    });

placeRouter.route('/:placeId/notes/:noteId')
    .options(corsWithOptions, (req, res) => res.sendStatus(200))
    .get(corsWithOptions, verifyUser, loadPlace, verifyPlaceOwner, async (req, res, next) => {

        try {
            const note = req.place.notes.id(req.params.noteId);

            if (!note) {
                const err = new Error('Note not found');
                err.status = 404;
                return next(err);
            }

            res.status(200).json(note.toJSON());
        } catch (err) {
            next(err)
        }

    })
    .post(corsMiddleware, (req, res) => {
        res.status(403).end(`POST operation not supported on /places/${req.params.placeId}/notes/${req.params.noteId}`);
    })
    .put(corsMiddleware, (req, res) => {
        res.status(403).end(`PUT operation not supported on /places/${req.params.placeId}/notes/${req.params.noteId}`);
    })
    .patch(corsWithOptions, verifyUser, loadPlace, verifyPlaceOwner, async (req, res, next) => {
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

            res.api(updated);

        } catch (err) {
            next(err);
        }
    })
    .delete(corsWithOptions, verifyUser, loadPlace, verifyPlaceOwner, async (req, res, next) => {
        try {
            const note = req.place.notes.id(req.params.noteId);

            if (!note) {
                const err = new Error('Note not found');
                err.status = 404;
                return next(err);
            }

            note.deleteOne();
            await req.place.save();
            res.status(200).json({ message: 'Note deleted' });
        } catch (err) {
            next(err);
        }
    });



export default placeRouter;