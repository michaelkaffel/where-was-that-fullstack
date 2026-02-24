import express from 'express';
import Place from '../models/places.js';


const placeRouter = express.Router();

placeRouter.route('/')
    .get((req, res, next) => {
        Place.find()
            .then(places => {
                res.status(200).json(places);
            })
            .catch(err => next(err));
    })
    .post((req, res, next) => {
        Place.create(req.body)
            .then(place => {
                console.log(`${req.body.kindOfPlace} created`, place);
                res.status(200).json(place);
            })
            .catch(err => next(err));
    })
    .put((req, res) => {
        res.status(403).end('PUT operation not supported on /places');
    })
    .delete((req, res) => {
        res.status(403).end('DELETE operation not supported');
    })

placeRouter.route('/:placeId')
    .get((req, res, next) => {
        Place.findById(req.params.placeId)
            .then(place => {
                res.status(200).json(place)
            })
            .catch(err => next(err));
    })
    .post((req, res) => {
        res.status(403).end(`POST operation not supported on /places/${req.params.placeId}`)
    })
    .put((req, res, next) => {
        Place.findByIdAndUpdate(req.params.placeId, {
            $set: req.body
        }, { new: true })
            .then(place => {
                res.status(200).json(place)
            })
            .catch(err => next(err));
    })
    .delete((req, res, next) => {
        Place.findByIdAndDelete(req.params.placeId)
            .then(response => {
                res.status(200).json(response);
            })
            .catch(err => next(err));
    });

placeRouter.route('/:placeId/notes')
    .get((req, res, next) => {
        Place.findById(req.params.placeId)
            .then(place => {
                if (place) {
                    res.status(200).json(place.notes)
                } else {
                    const err = new Error(`Place: ${req.params.placeId} not fount`);
                    err.status = 404;
                    return next(err);
                }
            })
            .catch(err => next(err));
    })
    .post((req, res, next) => {
        Place.findById(req.params.placeId)
            .then(place => {
                if (place) {
                    place.notes.push(req.body);
                    place.save()
                        .then(place => {
                            res.status(200).json(place);
                        })
                        .catch(err => next(err));
                } else {
                    const err = new Error(`Place: ${req.params.placeId} not found`);
                    err.status = 404;
                    return next(err);
                }
            })
            .catch(err => next(err));
    })
    .put((req, res) => {
        res.status(403).end(`PUT operation not supported on /places/${req.params.placeId}`)
    })
    .patch((req, res) => {
        res.status(403).end(`PATCH operation not supported on /places/${req.params.placeId}`)
    })
    .delete((req, res, next) => {
        Place.findById(req.params.placeId)
            .then(place => {
                if (place) {
                    for (let i = (place.notes.length -1 ); i >= 0; i--) {
                        place.notes.id(place.notes[i]._id).deleteOne();
                    }
                    place.save()
                        .then(place => {
                            res.status(200).json(place);
                        })
                        .catch(err => next(err))
                } else {
                    const err = new Error(`Place: ${req.params.placeId} not found`);
                    err.status = 404;
                    return next(err);
                }
            }) 
            .catch(err => next(err));
    });


export default placeRouter;