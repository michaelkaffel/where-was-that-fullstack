import { useState } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { Formik, Field, Form as FForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { baseUrl } from '../app/shared/baseUrl';

const EmailSchema = Yup.object({
    email: Yup.string()
        .email('Invalid email address')
        .required('Required')
});

const ForgotPasswordPage = () => {
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleForgotPassword = async (values) => {
        setIsLoading(true);
        setMessage(null);
        setError(null);

        try {
            const response = await fetch(baseUrl + 'auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: values.email })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Something went wrong');
                return;
            }

            setMessage(data.message);
        } catch (err) {
            setError('Unable to connect to server');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRecoverUsername = async (values) => {
        setIsLoading(true);
        setMessage(null);
        setError(null);

        try {
            const response = await fetch(baseUrl + 'auth/recover-username', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: values.email })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Something went wrong');
                return;
            }

            setMessage(data.message);
        } catch (err) {
            setError('Unable to connect to server');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container className='mt-5 top-padding-adjustment'>
            <Row className='justify-content-center'>
                <Col md={6} lg={5}>
                    <h2 className='mb-4 text-center font-setting'>Account Recovery</h2>
                    <p className='text-muted text-center mb-4 font-setting-second'>
                        Enter your email address and choose an option below.
                    </p>

                    {message && <Alert variant='success'>{message}</Alert>}
                    {error && <Alert variant='danger'>{error}</Alert>}

                    <Formik
                        initialValues={{ email: '' }}
                        validationSchema={EmailSchema}
                        onSubmit={() => { }}
                    >
                        {({ values, isValid, dirty, validateForm, setTouched }) => {

                            const handleClick = async (action) => {
                                const errors = await validateForm();
                                setTouched({ email: true })

                                if (Object.keys(errors).length === 0) {
                                    action(values);
                                }
                            };

                            return (
                                <FForm>
                                    <Form.Group className='mb-4'>
                                        <Form.Label htmlFor='email'>
                                            Email Address
                                        </Form.Label>
                                        <Field
                                            name='email'
                                            type='email'
                                            className='form-control'
                                            placeholder='Enter your email'
                                        />
                                        <ErrorMessage name='email'>
                                            {(msg) => <p className='text-danger mt-1'>{msg}</p>}
                                        </ErrorMessage>
                                    </Form.Group>

                                    <div className='d-grid gap-2'>
                                        <Button
                                            variant='primary'
                                            disabled={isLoading}
                                            onClick={() => handleClick(handleForgotPassword)}
                                        >
                                            {isLoading ? 'Sending...' : 'Reset Password'}
                                        </Button>
                                        <Button
                                            variant='outline-primary'
                                            disabled={isLoading}
                                            onClick={() => handleClick(handleRecoverUsername)}
                                        >
                                            {isLoading ? 'Sending...' : 'Recover Username'}
                                        </Button>
                                    </div>
                                </FForm>
                            )
                        }}
                    </Formik>

                    <p className='text-center mt-4'>
                        <Link to='/'>Back to Home</Link>
                    </p>
                </Col>
            </Row>
        </Container>
    );
};

export default ForgotPasswordPage;