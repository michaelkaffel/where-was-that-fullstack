
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons'

const Footer = () => {
    return (
        <footer className='bg-dark text-light py-3 mt-auto'>
            <Container>
                <Row className='align-items-center'>
                    <Col xs={12} md={6} className='text-center text-md-start mb-2 mb-md-0'>
                        <small>
                            © 2026 Where Was That · Built by{' '}
                            <a
                                href='https://michaelkaffel.com'
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-light'
                            >
                                Michael Kaffel
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
                            <FontAwesomeIcon icon={faGithub} size='lg'/>
                        </a>
                        <a
                            href='https://michaelkaffel.vercel.app'
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
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer