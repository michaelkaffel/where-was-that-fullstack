
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { useState } from 'react';
import PrivacyModal from './PrivacyModal';

const Footer = () => {
    const [showPrivacy, setShowPrivacy] = useState(false);
    return (
        <footer className='bg-dark text-light py-3 mt-auto'>
            <Container>
                <Row className='align-items-center'>
                    <Col xs={12} md={6} className='text-center text-md-start mb-2 mb-md-0'>
                        <small>
                            © 2026 Where Was That · Built by{' '}
                            <a
                                href='https://downbyriverdev.com'
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-light'
                            >
                                Down By The River Development
                            </a>
                        </small>
                    </Col>
                    <Col xs={12} md={6} className='text-center text-md-end'>
                        
                        <a
                            href='https://github.com/michaelkaffel/where-was-that-fullstack'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-light me-3'
                            aria-label='GitHub repository'
                        >
                            <FontAwesomeIcon icon={faGithub} size='lg' />
                        </a>
                        <a
                            href='https://michaelkaffel.com'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-light me-3'
                            aria-label='Portfolio'
                        >
                            <FontAwesomeIcon icon={faGlobe} size='lg' />
                        </a>
                        <a
                            href='mailto:contact@where-was-that.com'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-light me-3'
                            aria-label='Contact email'
                        >
                            <FontAwesomeIcon icon={faEnvelope} size='lg' />
                        </a>
                        <button
                            type='button'
                            onClick={() => setShowPrivacy(true)}
                            className='btn btn-link text-light p-0 align-baseline'
                            style={{ textDecoration: 'underline', fontSize: 'inherit' }}
                        >
                            Privacy Policy
                        </button>
                    </Col>
                </Row>
            </Container>

            <PrivacyModal show={showPrivacy} onHide={() => setShowPrivacy(false)} />
        </footer>
    );
};

export default Footer