

export const validateForm = (values) => {
    
    const { title, location, image, description } = values;
    const errors = {}

    if (!title) {
        errors.title = 'You need a title'
    } else if (title.length < 2) {
        errors.title = 'Must be 2 or more characters.'
    } else if (title.length > 50) {
        errors.title = 'Must be less than 50 characters.'
    }

    if (!location?.name) {
        errors.location = errors.location || {};
        errors.location.name = 'Location name required'
    } else if (location.name.length < 3) {
        errors.location = errors.location || {};
        errors.location.name = 'Please enter a full city and state.'
    } else if (location.name.length > 50) {
        errors.location = errors.location || {};
        errors.location.name = 'Maximum 50 characters';
    }

    if (!location?.lat || !location?.lng) {
        errors.location = errors.location || {};
        errors.location.lat = 'Drop a pin!';
    }


    if (!image) {
        errors.image = 'You are required to upload an image.'
    }

    if (!description) {
        errors.description = 'You need a description'
    }


    return errors
}