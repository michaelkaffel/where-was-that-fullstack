import { useState } from 'react';
import { Formik, Form as FForm, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserError, selectUserLoading, userSignup } from '../features/user/userSlice';
import { fetchPlaces } from '../features/places/placesSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SignupSchema = Yup.object({
    username: Yup.string().required('Required'),
    firstname: Yup.string().required('Required'),
    lastname: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Minimum 6 characters').required('Required')
});

const SignupModal = ({ show, onHide }) => {
    const dispatch = useDispatch();
    const error = useSelector(selectUserError);
    const isLoading = useSelector(selectUserLoading);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (values, { resetForm }) => {
        const result = await dispatch(userSignup(values));
        if (result.meta.requestStatus === 'fulfilled') {
            dispatch(fetchPlaces())
            resetForm();
            onHide();
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title >Sign Up</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <p className='text-danger text-center'>{error}</p>}
                <Formik
                    initialValues={{ username: '', firstname: '', lastname: '', email: '', password: '' }}
                    validationSchema={SignupSchema}
                    onSubmit={handleSubmit}
                >
                    <FForm>
                        <Form.Group className='mb-3'>
                            <Form.Label htmlFor='username'>Username</Form.Label>
                            <Field name='username' type='text' className='form-control' />
                            <ErrorMessage name='username'>
                                {(msg) => <p className='text-danger small'>{msg}</p>}
                            </ErrorMessage>
                        </Form.Group>
                        <Form.Group className='mb-3'>
                            <Form.Label htmlFor='password'>Password</Form.Label>
                            <div className='input-group'>
                                <Field
                                    name='password'
                                    type={showPassword ? 'text' : 'password'}
                                    className='form-control'
                                    // placeholder='Enter password'
                                />
                                <button
                                    type='button'
                                    className='btn btn-outline-secondary'
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <FontAwesomeIcon icon={showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'} />
                                </button>
                            </div>
                            <ErrorMessage name='password'>
                                {(msg) => <p className='text-danger small'>{msg}</p>}
                            </ErrorMessage>
                        </Form.Group>
                        <Form.Group className='mb-3'>
                            <Form.Label htmlFor='firstname'>First Name</Form.Label>
                            <Field name='firstname' type='text' className='form-control' />
                            <ErrorMessage name='firstname'>
                                {(msg) => <p className='text-danger small'>{msg}</p>}
                            </ErrorMessage>
                        </Form.Group>
                        <Form.Group className='mb-3'>
                            <Form.Label htmlFor='lastname'>Last Name</Form.Label>
                            <Field name='lastname' type='text' className='form-control' />
                            <ErrorMessage name='lastname'>
                                {(msg) => <p className='text-danger small'>{msg}</p>}
                            </ErrorMessage>
                        </Form.Group>
                        <Form.Group className='mb-3'>
                            <Form.Label htmlFor='email'>Email</Form.Label>
                            <Field name='email' type='text' className='form-control' />
                            <ErrorMessage name='email'>
                                {(msg) => <p className='text-danger small'>{msg}</p>}
                            </ErrorMessage>
                        </Form.Group>
                        <Form.Group className='d-grid gap-2'>
                            <Button type='submit' variant='primary' disabled={isLoading}>
                                {isLoading ? 'Creating account...' : 'Sign Up'}
                            </Button>
                            <hr className='my-2' />
                            <Button
                                variant='outline-danger'
                                href={`${process.env.REACT_APP_API_URL}/users/auth/google`}
                            >
                                Continue with Google
                            </Button>
                        </Form.Group>
                    </FForm>
                </Formik>
            </Modal.Body>
        </Modal>
    );
};

export default SignupModal;