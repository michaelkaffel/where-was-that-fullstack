

export const validateForm = (values) => {
    
    const { title, location, image, description } = values;
    const errors = {}

    if (!title) {
        errors.title = 'You need a title'
    } else if (title < 2) {
        errors.title = 'Must be 2 or more characters.'
    } else if (title > 50) {
        errors.title = 'Must be less than 50 characters.'
    }

    if (!location?.name) {
        errors['location.name'] = 'Required'
    } else if (location.name.length < 3) {
        errors['location.name'] = 'Please enter a full city and state.'
    } else if (location.name.length > 50) {
        errors['location.name'] = 'Maximum 50 characters'
    }

    if (!image) {
        errors.image = 'You are required to upload an image.'
    }

    if (!description) {
        errors.description = 'You need a description'
    }

    

    return errors
}