import { useState } from "react";
import { useDispatch } from "react-redux";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Stack from 'react-bootstrap/Stack';
import { Formik, Field, Form as FForm, ErrorMessage } from 'formik';
import { postNote } from './placesSlice';

const validate = (values) => {
    const errors = {};
    if (!values.text || values.text.trim() === '') {
        errors.text = 'Note text is required';
    }
    return errors
};

const NoteForm = ({ placeId }) => {
    const [show, setShow] = useState(false);
    const dispatch = useDispatch();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    const handleSubmit = (values, { resetForm }) => {
        dispatch(postNote({
            placeId,
            noteData: {
                text: values.text,
                date: new Date(Date.now()).toISOString()
            }
        }));
        resetForm();
        handleClose();
    };

    return (
        <>
            <Stack direction='horizontal'>
                <Button className='ms-auto' variant='primary' onClick={handleShow}>
                    Add Note
                </Button>
            </Stack>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add A Note</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        initialValues={{ text: '' }}
                        onSubmit={handleSubmit}
                        validate={validate}
                    >
                        <FForm>
                            <Form.Group className='mb-3'>
                                <Form.Label htmlFor='text'>Note</Form.Label>
                                <Field 
                                    name='text'
                                    as='textarea'
                                    placeholder='Add a note...'
                                    className='form-control'
                                />
                                <ErrorMessage name='text'>
                                    {(msg) => <p className='text-danger'>{msg}</p>}
                                </ErrorMessage>
                            </Form.Group>
                            <Stack direction='horizontal' className='mt-3'>
                                <Button variant='secondary' onClick={handleClose}>
                                    Close
                                </Button>
                                <Button className='ms-auto' type='submit'>
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

export default NoteForm;