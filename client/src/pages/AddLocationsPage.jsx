
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import AddCampsiteForm from '../features/campsites/AddCampsiteForm';
import AddHikeForm from '../features/hikes/AddHikeForm';
import hikePlaceholderImg from '../app/images/hikesPlaceholder.png';
import campsitePlaceholderImg from '../app/images/campsitesPlaceholder.png';
import overlookPlaceholderImg from '../app/images/overlookPlaceholder.png';
import imageOne from '../app/images/IMG_0117.jpeg';
import imageTwo from '../app/images/IMG_4064.jpeg';
import imageThree from '../app/images/IMG_2448.jpeg';
import imageFour from '../app/images/IMG_2241.jpeg';
import imageFive from '../app/images/IMG_2448.jpeg';
import AddOverlookForm from '../features/overlooks/AddOverlookForm';

const imageArray = [
    hikePlaceholderImg,
    campsitePlaceholderImg,
    overlookPlaceholderImg,
    imageOne,
    imageTwo,
    imageThree,
    imageFour,
    imageFive
]




const AddLocationsPage = () => {


    const imageToShow = imageArray[Math.floor(Math.random() * imageArray.length)]



    return (
        <>
            <Container>
                <Row>
                    <Col>
                        <Accordion>
                            <Accordion.Item eventKey='0'>
                                <Accordion.Header>Add a Hike!</Accordion.Header>
                                <Accordion.Body>
                                    <AddHikeForm />
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey='1'>
                                <Accordion.Header>Add a Campsite!</Accordion.Header>
                                <Accordion.Body>
                                    <AddCampsiteForm />
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey='2'>
                                <Accordion.Header>Add an Overlook!</Accordion.Header>
                                <Accordion.Body>
                                    <AddOverlookForm />
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                        <img className='img-fluid mt-3 rounded' alt='Beautiful scenery' src={imageToShow} />
                    </Col>
                </Row>
            </Container>

        </>
    )
};

export default AddLocationsPage;