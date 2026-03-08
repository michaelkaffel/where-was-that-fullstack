import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Formik, Field, Form as FForm, ErrorMessage } from 'formik';
import { userLogin } from '../features/user/userSlice';
import { selectCurrentUser, selectUserError, selectUserLoading } from '../features/user/userSlice';

const LoginSchema = Yup.object({
    username: Yup.string().required('Required'),
    password: Yup.string().required('Required')
})

const LoginModal = ({ show, onHide }) => {
    const dispatch = useDispatch();
    const error = useSelector(selectUserError);
    const isLoading = useSelector(selectUserLoading);

    const handleSubmit = async (values, { resetForm }) => {
        const result = await dispatch(selectCurrentUser(values));
        if (result.meta.requestStatus === 'fulfilled') {
            resetForm()
            onHide();
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Log In</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <p className='text-danger text-center'>{error}</p>}
                <Formik
                    initialValues={{ username: '', password: ''}}
                    validationSchema={LoginSchema}
                    onSubmit={handleSubmit}
                    
                >
                    <FForm>
                        <Form.Group className='mb-3'>
                            <Form.Label htmlFor='username'>Username</Form.Label>
                            <Field name='username' className='form-control' placeholder='Enter username' />
                            <ErrorMessage name='username'>
                                {(msg) => <p className='text-danger'>{msg}</p>}
                            </ErrorMessage>
                        </Form.Group>
                        <Form.Group className='mb-3'>
                            <Form.Label htmlFor='password'>Password</Form.Label>
                            <Field name='password' className='form-control' />
                            <ErrorMessage name='password'>
                                {(msg) => <p className='text-danger'>{msg}</p>}
                            </ErrorMessage>
                        </Form.Group>
                        <div className='d-grid gap-2'>
                            <Button type='submit' variant='primary' disabled={isLoading}>
                                {isLoading ? 'Logging in...' : 'Log In'}
                            </Button>
                            <hr className='my-2'/>
                            <Button
                                variant='outline-danger'
                                href={`${process.env.REACT_APP_API_URL}/users/auth/google`}
                            >
                                Continue with Google
                            </Button>
                        </div>
                    </FForm>
                </Formik>
            </Modal.Body>
        </Modal>
    );
};

export default LoginModal;