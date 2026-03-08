import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';
import { userSignup, selectUserError, selectUserLoading } from '../features/user/userSlice';

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

    const handleSubmit = async (values, { resetForm }) => {
        const result = await dispatch(userSignup(values));
        if (result.meta.requestStatus === 'fulfilled') {
            resetForm();
            onHide();
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Sign Up</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <p className='text-danger text-center'>{error}</p>}
                <Formik
                    initialValues={{ username: '', firstname: '', lastname: '', email: '', password: '' }}
                    validationSchema={SignupSchema}
                    onSubmit={handleSubmit}
                >
                    <Form>
                        {['username', 'firstname', 'lastname', 'email', 'password'].map((field) => (
                            <div className='mb-3' key={field}>
                                <label htmlFor={field} className='form-label'>
                                    {field.charAt(0).toUpperCase() + field.slice(1)}
                                </label>
                                <Field
                                    name={field}
                                    type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                                    className='form-control'
                                />
                                <ErrorMessage name={field} component='div' className='text-danger small'></ErrorMessage>
                            </div>
                        ))}
                        <div className='d-grid gap-2'>
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
                        </div>
                    </Form>
                </Formik>
            </Modal.Body>
        </Modal>
    );
};

export default SignupModal;