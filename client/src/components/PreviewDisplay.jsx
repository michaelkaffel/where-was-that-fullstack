import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useSelector } from 'react-redux';
import { selectRandomPlaceByType } from '../features/places/placesSlice';
import { selectIsAuthenticated } from '../features/user/userSlice'
import PreviewCard from './PreviewCard';

const PreviewDisplay = ({ onShowLogin, onShowSignup }) => {

    const isAuthenticated = useSelector(selectIsAuthenticated);
    const campsite = useSelector(selectRandomPlaceByType('campsite'));
    const hike = useSelector(selectRandomPlaceByType('hike'));
    const overlook = useSelector(selectRandomPlaceByType('overlook'));

    if (!isAuthenticated) {
        return (
            <Container className='text-center mt-4'>
                <h3>Keep track of all your favorite places</h3>
                <p className='text-muted'>
                    Save your hiking trails, camping spots, and scenic overlooks - complete with photos and notes.
                </p>
                <div className='d-flex justify-content-center gap-3 mt-3'>
                    <Button variant='primary' onClick={onShowLogin} >Log In</Button>
                    <Button variant='outline-primary' onClick={onShowSignup} >Sign Up</Button>
                </div>
            </Container>
        )
    }

    return (


        <Container>

            <Row>
                <Col md='4'>
                    {hike ? <PreviewCard item={hike} /> : <h4 className='text-center mt-3'>Add some hikes!</h4>}

                </Col>

                <Col md='4'>

                    {campsite ? <PreviewCard item={campsite} /> : <h4 className='text-center mt-3'>Add some campsites!</h4>}
                </Col>

                <Col md='4'>

                    {overlook ? <PreviewCard item={overlook} /> : <h4 className='text-center mt-3'>Add some overlooks!</h4>}
                </Col>

            </Row>
        </Container>



    );
};

export default PreviewDisplay;

