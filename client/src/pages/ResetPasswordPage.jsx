import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { Formik, Field, Form as FForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { baseUrl } from '../app/shared/baseUrl';

const ResetPasswordSchema = Yup.object({
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Required')
});

const ResetPasswordPage = () => {
    const { token } = useParams();
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isReset, setIsReset] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (values) => {
        setIsLoading(true);
        setMessage(null);
        setError(null);
        
        try {
            const response = await fetch(baseUrl + `auth/reset-password/${token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: values.password })
            });

            const data = await response.json();

            if (!response.ok) { setError(data.message || 'Something went wrong');
                return;
            }

            setMessage(data.message);
            setIsReset(true);
        } catch (err) {
            setError('Unable to connect to server');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container className='mt-5'>
            <Row className='justify-content-center'>
                <Col md={6} lg={5}>
                    <h2 className='mb-4 text-center font-setting'>Reset Password</h2>

                    {message && <Alert variant='success'>{message}</Alert>}
                    {error && <Alert variant='danger'>{error}</Alert>}

                    {isReset ? (
                        <div className='text-center'>
                            <p>You can now log in with your new password.</p>
                            <Link to='/'>Go to Home</Link>
                        </div>
                    ) : (
                        <Formik
                            initialValues={{ password: '', confirmPassword: ''}}
                            validationSchema={ResetPasswordSchema}
                            onSubmit={handleSubmit}
                        >
                            <FForm>
                                <Form.Group className='mb-3'>
                                    <Form.Label htmlFor='password'>New Password</Form.Label>
                                    <div className='input-group'>
                                        <Field 
                                            name='password'
                                            type={showPassword ? 'text' : 'password'}
                                            className='form-control'
                                        />
                                        <button
                                            type='button'
                                            className='btn btn-outline-secondary'
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            <FontAwesomeIcon 
                                                icon={showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'}
                                            />
                                        </button>
                                    </div>
                                    <ErrorMessage name='password'>
                                        {(msg) => <p className='text-danger mt-1'>{msg}</p>}
                                    </ErrorMessage>
                                </Form.Group>

                                <Form.Group className='mb-4'>
                                    <Form.Label htmlFor='confirmPassword'>Confirm Password</Form.Label>
                                    <Field 
                                        name='confirmPassword'
                                        type={showPassword ? 'text' : 'password'}
                                        className='form-control'
                                    />
                                    
                                    <ErrorMessage name='confirmPassword'>
                                        {(msg) => <p className='text-danger mt-1'>{msg}</p>}
                                    </ErrorMessage>
                                </Form.Group>

                                <div className='d-grid'>
                                    <Button type='submit' variant='primary' disabled={isLoading}>
                                        {isLoading ? 'Resetting...' : 'Set New Password'}
                                    </Button>
                                </div>
                            </FForm>
                        </Formik>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default ResetPasswordPage;