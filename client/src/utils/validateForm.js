

export const validateForm = (values) => {
    
    const { title, location } = values;
    const errors = {}

    if (!title) {
        errors.title = 'Required'
    } else if (title < 2) {
        errors.title = 'Must be 2 or more characters.'
    } else if (title > 50) {
        errors.title = 'Must be less than 50 characters.'
    }

    if (!location) {
        errors.location = 'Required'
    } else if (location < 3) {
        errors.location = 'Please enter a full city and state.'
    } else if (location > 50) {
        errors.location = 'Maximum 50 characters'
    }

    

    return errors
}