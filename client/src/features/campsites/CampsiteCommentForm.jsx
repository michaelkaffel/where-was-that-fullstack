import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import { Formik, Field, Form as FForm, ErrorMessage } from 'formik';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Stack from 'react-bootstrap/Stack';
import { postCampsiteComment } from './campsitesCommentsSlice';
import { validateCommentForm } from '../../utils/validateCommentForm'

const CampsiteCommentForm = ({ campsiteId }) => {

    const [show, setShow] = useState(false);

    const dispatch = useDispatch()

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = (values) => {

        

        const comment = {
            campsiteId: parseInt(campsiteId),
            text: values.commentText,
            date: new Date(Date.now()).toISOString(),
            

        }

        dispatch(postCampsiteComment(comment));
        setShow(false)

    }

    return (
        <>
            <Stack direction="horizontal">
                <Button className='ms-auto' variant='primary' onClick={handleShow}>
                    Add Comment!
                </Button>
            </Stack>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add A Comment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        initialValues={{
                            commentText: '',
                        }}
                        onSubmit={handleSubmit}
                        validate={validateCommentForm}
                    >
                        <FForm>
                            <Form.Group>
                                <Form.Label htmlFor='commentText' >Comment</Form.Label>
                                <Field
                                    name='commentText'
                                    as='textarea'
                                    placeholder='Add a comment!'
                                    className='form-control'
                                />
                                <ErrorMessage name='commentText'>
                                    {(msg) => <p className='text-danger'>{msg}</p>}
                                </ErrorMessage>
                            </Form.Group>
                            <Stack direction="horizontal" className='mt-3' >
                                <Button variant='secondary' onClick={handleClose}>
                                    Close
                                </Button>
                                <Button className='ms-auto' type='submit' color="primary">
                                    Submit
                                </Button>
                            </Stack>
                        </FForm>
                    </Formik>

                </Modal.Body>
            </Modal>
        </>
    );
};

export default CampsiteCommentForm;