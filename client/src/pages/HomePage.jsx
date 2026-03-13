import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PreviewDisplay from '../components/PreviewDisplay';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../features/user/userSlice';
import { useState } from 'react';
import LoginModal from '../components/LoginModal';
import SignupModal from '../components/SignupModal';

const Home = () => {

    const isAuthenticated = useSelector(selectIsAuthenticated);
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);

    return (
        
            <div className='hero top-padding-adjustment'>
                <Container>

                    <Row className='hero-row'>
                        <Col xs={10} lg='6' className='hero-text-box m-auto d-flex flex-column justify-content-between'>
                            <h1 className='hero-title text-center'>WHERE WAS THAT</h1>
                            <h3 className='hero-subtitle text-center'>Keep track of all your favorite hiking trails, camping spots, and scenic overlooks.</h3>
                        </Col>
                    </Row>

                    {isAuthenticated && (
                        <Row className='mt-3'>
                            <Col className='text-center mb-2'>
                                <Link to='/hiking-trails'>
                                    <Button variant="primary" className='home-page-row-btns'>
                                        Hikes
                                    </Button>
                                </Link>
                            </Col>
                            <Col className='text-center mb-2'>
                                <Link to='/camping-spots'>
                                    <Button variant="primary" className='home-page-row-btns'>
                                        Campsites
                                    </Button>
                                </Link>
                            </Col>
                            <Col className='text-center mb-2'>
                                <Link to='/scenic-overlooks'>
                                    <Button variant="primary" className='home-page-row-btns'>
                                        Overlooks
                                    </Button>
                                </Link>
                            </Col>
                        </Row>
                    )}

                </Container>

                <Container>
                    <Row className='preview-display-row'>
                        <Col xs={10} className='mx-auto preview-display-background'>
                            <PreviewDisplay
                                onShowLogin={() => setShowLogin(true)}
                                onShowSignup={() => setShowSignup(true)}
                            />

                            <LoginModal show={showLogin} onHide={() => setShowLogin(false)} />
                            <SignupModal show={showSignup} onHide={() => setShowSignup(false)} />
                        </Col>
                    </Row>

                </Container>
            </div>



        
    );
};

export default Home;