import { useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Formik, Field, Form as FForm, ErrorMessage } from 'formik';
import { validateForm } from '../../utils/validateForm';
import { processImage16x9 } from '../../utils/processImage16x9';
import { postHike } from './hikesSlice';



const AddHikeForm = () => {

    const dispatch = useDispatch();

    const HandleSubmit = async (values, { resetForm }) => {

        const hike = {
            title: values.title,
            description: values.description,
            image: values.image,
            location: values.location,
            dateVisited: values.dateVisited,
            favorite: false,
            kindOfPlace: 'hike',
        };

        dispatch(postHike(hike));
        resetForm();
    }

    return (

        <Formik
            initialValues={{
                title: '',
                description: '',
                image: null,
                location: '',
                dateVisited: '',
            }}
            onSubmit={HandleSubmit}
            validate={validateForm}
        >
            {({ setFieldValue, values }) => (
                <FForm>
                    <Form.Group>
                        <Form.Label htmlFor='title'>
                            Title
                        </Form.Label>
                        <Field name='title' placeholder='Name of your hike...' className='form-control' />
                        <ErrorMessage name='title'>
                            {(msg) => <p className='text-danger'>{msg}</p>}
                        </ErrorMessage>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor='location'>
                            Location
                        </Form.Label>
                        <Field name='location' placeholder='Ex: City, State' className='form-control' />
                        <ErrorMessage name='location'>
                            {(msg) => <p className='text-danger'>{msg}</p>}
                        </ErrorMessage>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor='dateVisited'>
                            Date Visited
                        </Form.Label>
                        <Field name='dateVisited' required type='date' className='form-control' />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor='description'>
                            Description
                        </Form.Label>
                        <Field name='description' required as='textarea' placeholder='Describe your hike...' className='form-control' />
                    </Form.Group>
                    <Form.Group>
                        <div>
                            <Form.Label htmlFor='description'>
                                Image
                            </Form.Label>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                                const file = e.currentTarget.files[0];
                                if (!file) return;

                                const processed = await processImage16x9(file)
                                setFieldValue('image', processed)
                            }}
                        />
                        {values.image && (
                            <small className='text-muted'>
                                Selected: {values.image.name}
                            </small>
                        )}
                        <div>
                            {values.image && (
                                <img
                                    src={values.image}
                                    alt='Preview'
                                    style={{ width: '50%', objectFit: 'cover', marginTop: 10 }}
                                />
                            )}
                        </div>
                    </Form.Group>
                    <Button className='mt-3' type='submit' color='primary'>Add Hike!</Button>
                </FForm>
            )}
        </Formik>

    )
}

export default AddHikeForm;