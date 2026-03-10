import Place from "./models/place.js";


export const loadPlace = async (req, res, next) => {
    try {
        const place = await Place
            .findById(req.params.placeId)
            .populate('owner');


        if (!place) {
            const err = new Error('Place not found');
            err.status = 404;
            return next(err);
        }

        req.place = place;
        next();
    } catch (err) {
        next(err);
    }
};

export const loadPlaces = async (req, res, next) => {
    console.log('loadPlaces - req.user._id:', req.user._id);
    try {
        const places = await Place.find({ owner: req.user._id })
            .populate('owner')
            .sort({ createdAt: -1 });
        console.log('loadPlaces - found places:', places.length);
        req.places = places;
        next();
    } catch (err) {
        next(err)
    }
};

export const verifyPlaceOwner = (req, res, next) => {
    if (!req.place.owner.equals(req.user._id)) {
        const err = new Error('Not authorized, wrong user');
        err.status = 403;
        return next(err);
    }

    next();
};

const normalizeDoc = (doc) => {
    if (doc && typeof doc.toObject === 'function') {
        return doc.toObject();
    }
}

export const responseHelper = (req, res, next) => {
    res.api = (data, statusCode = 200) => {
        if (Array.isArray(data)) {
            return res.status(statusCode).json(data.map(normalizeDoc));
        }
        return res.status(statusCode).json(normalizeDoc(data));
    }
    next();
}



// export const verifyPlaceOwner = async (req, res, next) => {
//     try {
//         const place = await Place.findById(req.params.placeId);

//         if (!place) {
//             const err = new Error('Place not found');
//             err.status = 404;
//             return next(err);
//         }

//         if (!place.owner || !place.owner.equals(req.user._id)) {
//             const err = new Error('Not authorized');
//             err.status = 403;
//             return next(err);
//         }

//         req.place = place;
//         next();
//     } catch(err) {
//         next(err);
//     }
// };