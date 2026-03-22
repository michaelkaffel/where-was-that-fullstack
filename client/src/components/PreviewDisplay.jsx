import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useSelector } from 'react-redux';
import { selectRandomPlaceByType } from '../features/places/placesSlice';
import { selectIsAuthenticated } from '../features/user/userSlice';
import { Link } from 'react-router-dom';
import PreviewCard from './PreviewCard';

const PreviewDisplay = ({ onShowLogin, onShowSignup }) => {

    const isAuthenticated = useSelector(selectIsAuthenticated);
    const campsite = useSelector(selectRandomPlaceByType('campsite'));
    const hike = useSelector(selectRandomPlaceByType('hike'));
    const overlook = useSelector(selectRandomPlaceByType('overlook'));

    const detailPaths = {
        hike: '/hiking-trails',
        campsite: '/camping-spots',
        overlook: '/scenic-overlooks'
    }

    if (!isAuthenticated) {
        return (
            <Container className='text-center'>
                <h3 className='text-white'>LOG IN OR CREATE YOUR ACCOUNT</h3>
                <p className='text-white font-setting-secondary'>
                    Save your hiking trails, camping spots, and scenic overlooks - complete with photos and notes.
                </p>
                <div className='d-flex justify-content-center gap-3 mt-3'>
                    <Button data-testid='hero-login-btn' variant='primary' onClick={onShowLogin} >Log In</Button>
                    <Button data-testid='hero-signup-btn' variant='outline-primary' onClick={onShowSignup} >Sign Up</Button>
                </div>
            </Container>
        )
    }

    return (


        <Container>
            <Row className='justify-content-center'>
                <Col>
                    <h2 className='text-center font-setting-second'>Revisit Your Locations</h2>
                </Col>
            </Row>

            <Row className='justify-content-center'>
                <Col md={10} lg={4}>
                    {hike ? (
                        <Link to={`${detailPaths.hike}/${hike.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <PreviewCard item={hike} />
                        </Link>

                    ) : (
                        <h4 className='text-center mt-3 text-white'>Add some hikes!</h4>
                    )}

                </Col>

                <Col md={10} lg={4}>

                    {campsite ? (
                        <Link to={`${detailPaths.campsite}/${campsite.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <PreviewCard item={campsite} />
                        </Link>
                    ) : (
                        <h4 className='text-center mt-3 text-white'>Add some campsites!</h4>
                    )}
                </Col>

                <Col md={10} lg={4}>

                    {overlook ? (
                         <Link to={`${detailPaths.overlook}/${overlook.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <PreviewCard item={overlook} />
                        </Link>
                    ) : (
                        <h4 className='text-center mt-3 text-white'>Add some overlooks!</h4>
                    )}
                </Col>

            </Row>
        </Container>



    );
};

export default PreviewDisplay;

