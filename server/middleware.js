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

export const verifyPlaceOwner = (req, res, next) => {
    if (!req.place.owner.equals(req.user._id)) {
        const err = new Error('Not authorized, wrong user');
        err.status = 403;
        return next(err);
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