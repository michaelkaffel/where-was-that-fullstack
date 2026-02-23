
export const validateCommentForm = (values) => {
    const { commentText } = values;
    const errors = {};

    if (!commentText) {
        errors.commentText = 'Required'
    }

    return errors
}