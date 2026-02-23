const express = require('express');
const Place = require('../models/places');

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

module.exports = placeRouter;