import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { Formik, Form as FForm, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { selectCurrentUser, selectUserLoading, selectUserError, patchCurrentUser, deleteCurrentUser, clearCurrentUser } from '../features/user/userSlice';

const passwordSchema = Yup.object({
    currentPassword: Yup.string().required('Current password is required'),
    newPassword: Yup.string().min(6, 'Password must be at least 6 characters').required('New password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords must match')
        .required('Please confirm your new password')
});

const UserProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector(selectCurrentUser);
    const isLoading = useSelector(selectUserLoading);
    const error = useSelector(selectUserError);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);

    const handlePasswordChange = async (values, { resetForm }) => {
        const result = await dispatch(patchCurrentUser({
            currentPassword: values.currentPassword,
            newPassword: values.newPassword
        }));
        if (result.meta.requestStatus === 'fulfilled') {
            setPasswordSuccess(true);
            resetForm();
        }
    };

    const handleDeleteAccount = async () => {
        const result = await dispatch(deleteCurrentUser());
        if (result.meta.requestStatus === 'fulfilled') {
            dispatch(clearCurrentUser());
            setShowDeleteModal(false);
            setShowSuccessModal(true);
        }
    };

    return (
        <div className='top-padding-adjustment'>
            <Container className='top-padding-adjustment py-5'>
                <Row className='justify-content-center'>
                    <Col md={6}>
                        <Card className='text-center mb-4 shadow-sm'>
                            <Card.Body className='py-4'>
                                <FontAwesomeIcon icon='fa-solid fa-user-circle' size='3x' className='mb-3 text-secondary' />
                                <Card.Title as='h2'>Welcome, {currentUser?.username}</Card.Title>
                                <Card.Text className='text-muted'>
                                    {currentUser?.firstname} {currentUser?.lastname}
                                </Card.Text>
                            </Card.Body>
                        </Card>

                        {currentUser?.hasPassword && (
                            <Card className='mb-4 shadow-sm'>
                                <Card.Header><h5 className='mb-0'>Change Password</h5></Card.Header>
                                <Card.Body>
                                    {passwordSuccess && (
                                        <div className='alert alert-success'>Password updated successfully</div>
                                    )}
                                    {error && (
                                        <div className='alert alert-danger'>{error}</div>
                                    )}
                                    <Formik
                                        initialValues={{ currentPassword: '', newPassword: '', confirmPassword: '' }}
                                        validationSchema={passwordSchema}
                                        onSubmit={handlePasswordChange}
                                    >
                                        <FForm>
                                            <Form.Group className='mb-3'>
                                                <Form.Label>Current Password</Form.Label>
                                                <div className='input-group'>
                                                    <Field name='currentPassword' type={showPassword ? 'text' : 'password'} className='form-control' />
                                                    <button type='button' className='btn btn-outline-secondary' onClick={() => setShowPassword(!showPassword)}>
                                                        <FontAwesomeIcon icon={showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'} />
                                                    </button>
                                                </div>
                                                <ErrorMessage name='currentPassword'>
                                                    {(msg) => <p className='text-danger small mt-1'>{msg}</p>}
                                                </ErrorMessage>
                                            </Form.Group>
                                            <Form.Group className='mb-3'>
                                                <Form.Label>New Password</Form.Label>
                                                <div className='input-group'>
                                                    <Field name='newPassword' type={showNewPassword ? 'text' : 'password'} className='form-control' />
                                                    <button type='button' className='btn btn-outline-secondary' onClick={() => setShowNewPassword(!showNewPassword)}>
                                                        <FontAwesomeIcon icon={showNewPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'} />
                                                    </button>
                                                </div>
                                                <ErrorMessage name='newPassword'>
                                                    {(msg) => <p className='text-danger small mt-1'>{msg}</p>}
                                                </ErrorMessage>
                                            </Form.Group>
                                            <Form.Group className='mb-3'>
                                                <Form.Label>Confirm New Password</Form.Label>
                                                <Field name='confirmPassword' type='password' className='form-control' />
                                                <ErrorMessage name='confirmPassword'>
                                                    {(msg) => <p className='text-danger small mt-1'>{msg}</p>}
                                                </ErrorMessage>
                                            </Form.Group>
                                            <div className='d-grid'>
                                                <Button type='submit' variant='primary' disabled={isLoading} >
                                                    {isLoading ? 'Updating...' : 'Update Password'}
                                                </Button>
                                            </div>
                                        </FForm>
                                    </Formik>
                                </Card.Body>
                            </Card>
                        )}

                        {/* Delete Account Card */}

                        <Card className='mb-4 shadow-sm border-danger'>
                            <Card.Header className='bg-danger text-white'>
                                <h5 className='mb-0'>Delete Account</h5>
                            </Card.Header>
                            <Card.Body>
                                <Card.Text className='text-muted'>
                                    This will permanently delete your account and all your saved places and notes. This action cannot be undone.
                                </Card.Text>
                                <div className='d-grid'>
                                    <Button variant='danger' onClick={() => setShowDeleteModal(true)}>
                                        Delete My Account
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Are you sure?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant='secondary' onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant='danger' onClick={handleDeleteAccount} disabled={isLoading}>
                        {isLoading ? 'Deleting...' : 'Yes, delete my account'}
                    </Button>
                </Modal.Footer>
            </Modal>


            {/* Account Deleted Success Modal */}

            <Modal show={showSuccessModal} centered backdrop='static' keyboard={false}>
                <Modal.Header>
                    <Modal.Title>Account Deleted</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Your account has been successfully deleted.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='primary' onClick={() => navigate('/', { replace: true })}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UserProfilePage