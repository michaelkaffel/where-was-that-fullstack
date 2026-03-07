import { useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Formik, Field, Form as FForm, ErrorMessage } from 'formik';
import { validateForm } from '../../utils/validateForm';
import { processImage16x9 } from '../../utils/processImage16x9';
import { postPlace } from './placesSlice';

const AddPlaceForm = ({ kindOfPlace, titlePlaceholder, descriptionPlaceholder, submitLabel }) => {
    const dispatch = useDispatch();

    const handleSubmit = async (values, { resetForm }) => {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('location', values.location);
        formData.append('dateVisited', values.dateVisited);
        formData.append('kindOfPlace', kindOfPlace);
        formData.append('favorite', false);

        if (values.image) {
            formData.append('image', values.image, 'image.jpg');
        }

        dispatch(postPlace(formData));
        resetForm();
    };

    return (
        <Formik
            initialValues={{
                title: '',
                description: '',
                image: null,
                location: '',
                dateVisited: '',
            }}
            onSubmit={handleSubmit}
            validate={validateForm}
        >
            {({ setFieldValue, values }) => (
                <FForm>
                    <Form.Group>
                        <Form.Label htmlFor='title'>Title</Form.Label>
                        <Field name='title' placeholder={titlePlaceholder} className='form-control' />
                        <ErrorMessage name='title'>
                            {(msg) => <p className='text-danger'>{msg}</p>}
                        </ErrorMessage>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor='location'>Location</Form.Label>
                        <Field name='location' placeholder='Ex: City, State' className='form-control' />
                        <ErrorMessage name='location'>
                            {(msg) => <p className='text-danger'>{msg}</p>}
                        </ErrorMessage>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor='dateVisited'>Date Visited</Form.Label>
                        <Field name='dateVisited' type='date' className='form-control' />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor='description'>Description</Form.Label>
                        <Field name='description' as='textarea' placeholder={descriptionPlaceholder} className='form-control' />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor='image'>Image</Form.Label>
                        <input 
                            type='file'
                            accept='image/*'
                            onChange={async (e) => {
                                const file = e.currentTarget.files[0];
                                if (!file) return;
                                const blob = await processImage16x9(file);
                                setFieldValue('image', blob);
                            }}
                        />
                        {values.image && (
                            <img 
                                src={URL.createObjectURL(values.image)}
                                alt='Preview'
                                style={{ width: '50%', objectFit: 'cover', marginTop: 10 }}
                            />
                        )}
                    </Form.Group>
                    <Button className='mt-3' type='submit'>{submitLabel}</Button>
                </FForm>
            )}
        </Formik>
    );
};

export default AddPlaceForm;