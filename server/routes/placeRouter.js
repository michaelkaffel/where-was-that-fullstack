import express from 'express';
import Place from '../models/place.js';
import { verifyUser } from '../authenticate.js';


const placeRouter = express.Router();

const verifyPlaceOwner = async (req, res, next) => {
    try {
        const place = await Place.findById(req.params.placeId);

        if (!place) {
            const err = new Error('Place not found');
            err.status = 404;
            return next(err);
        }

        if (!place.owner || !place.owner.equals(req.user._id)) {
            const err = new Error('Not authorized');
            err.status = 403;
            return next(err);
        }

        req.place = place;
        next();
    } catch(err) {
        next(err);
    }
};

placeRouter.route('/')
    .get(verifyUser, async (req, res, next) => {
        try {
            const places = await Place.find({ owner: req.user._id})
                .populate('owner', 'username');
            
            res.status(200).json(places);
        } catch (err) {
            next(err);
        }
    })
    .post(verifyUser, async (req, res, next) => {
        try {
            req.body.owner = req.user._id;

            const place = await Place.create(req.body);

            const populated = await Place.findById(place._id)
                .populate('owner', 'username');

            res.status(201).json(populated);
        } catch (err) {
            next(err);
        }
    })
    .put((req, res) => {
        res.status(403).end('PUT operation not supported on /places');
    })
    .delete((req, res) => {
        res.status(403).end('DELETE operation not supported');
    })

placeRouter.route('/:placeId') //RECHECK THIS ONE
    .get(verifyUser, verifyPlaceOwner, async (req, res) => {
        const populated = await req.place.populate('owner', 'username');
        res.status(200).json(populated);
    })
    .post((req, res) => {
        res.status(403).end(`POST operation not supported on /places/${req.params.placeId}`)
    })
    .put((req, res) => {
        res.status(403).end(`PUT operation not supported on /places/${req.params.placeId}`)
    })
    .patch(verifyUser, verifyPlaceOwner, async (req, res, next) => {
        try {
            if (Object.keys(req.body).length !== 1 || typeof req.body.favorite !== 'boolean') {
                return res.status(400).json({ message: 'Only favorite boolean may be updated'});
            }

            req.place.favorite = req.body.favorite;

            const updated = await req.place.save();
            
            res.status(200).json(updated);
        } catch (err) {
            next(err);
        }
    })
    .delete(verifyUser, verifyPlaceOwner, async (req, res, next) => {
        try {
            await req.place.deleteOne();
            res.status(200).json({ message: 'Place deleted' });
        } catch (err) {
            next(err);
        }
    });

placeRouter.route('/:placeId/notes')
    .get(verifyUser, verifyPlaceOwner, async (req, res, next) => {
        res.status(200).json(req.place.notes);
    })
    .post(verifyUser, verifyPlaceOwner, async (req, res, next) => {
        try {
            req.place.notes.push(req.body);
            const updated = await req.place.save();
            res.status(201).json(updated);
        } catch (err) {
            next(err);
        }
    })
    .put((req, res) => {
        res.status(403).end(`PUT operation not supported on /places/${req.params.placeId}`)
    })
    .patch((req, res) => {
        res.status(403).end(`PATCH operation not supported on /places/${req.params.placeId}`)
    })
    .delete(verifyUser, verifyPlaceOwner, async (req, res, next) => {
        try {
            req.place.notes = [];
            const updated = await req.place.save();
            res.status(200).json(updated);
        } catch (err) {
            next(err);
        }
    });

placeRouter.route('/:placeId/notes/:noteId')
    .get(verifyUser, verifyPlaceOwner, async (req, res, next) => {
        const note = req.place.notes.id(req.params.noteId);

        if (!note) {
            const err = new Error('Note not found');
            err.status = 404;
            return next(err);
        }

        res.status(200).json(note);
    })
    .post((req, res) => {
        res.status(403).end(`POST operation not supported on /places/${req.params.placeId}/notes/${req.params.noteId}`);
    })
    .put((req, res) => {
        res.status(403).end(`PUT operation not supported on /places/${req.params.placeId}/notes/${req.params.noteId}`);
    })
    .patch(verifyUser, verifyPlaceOwner, async (req, res, next) => {
        try {
            const note = req.place.notes.id(req.params.noteId);

            if (!note) {
                const err = new Error('Note not found');
                err.status = 404;
                return next(err);
            }

            if (typeof req.body.text !== 'string' || req.body.text.trim() === '') {
                return res.status(400).json({ message: 'Text must be a non-empty string'});
            }

            note.text = req.body.text;
            const updated = await req.place.save();

            res.status(200).json(updated);

        } catch (err) {
            next(err);
        }
    })
    .delete(verifyUser, verifyPlaceOwner, async (req, res, next) => {
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