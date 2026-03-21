
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import AddPlaceForm from '../features/places/AddPlaceForm';
import HomeMap from '../components/HomeMap';


const AddLocationsPage = () => {

    return (

        <Container>
            <Row>
                <Col>
                    <h2 className='mt-3 text-center font-setting'>
                        Add Your Locations
                    </h2>
                </Col>
                <Col className='mx-auto mt-3' xs={12}>
                    <Accordion>
                        <Accordion.Item eventKey='0'>
                            <Accordion.Header>Add a Hike!</Accordion.Header>
                            <Accordion.Body>
                                <AddPlaceForm
                                    kindOfPlace='hike'
                                    titlePlaceholder='Name of your hike...'
                                    descriptionPlaceholder='Describe your hike...'
                                    submitLabel='Add Hike!'
                                />
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey='1'>
                            <Accordion.Header>Add a Campsite!</Accordion.Header>
                            <Accordion.Body>
                                <AddPlaceForm
                                    kindOfPlace='campsite'
                                    titlePlaceholder='Name of your campground...'
                                    descriptionPlaceholder='Describe your campsite...'
                                    submitLabel='Add Campsite!'
                                />
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey='2'>
                            <Accordion.Header>Add an Overlook!</Accordion.Header>
                            <Accordion.Body>
                                <AddPlaceForm
                                    kindOfPlace='overlook'
                                    titlePlaceholder='Name of your overlook...'
                                    descriptionPlaceholder='Describe your overlook...'
                                    submitLabel='Add Overlook!'
                                />
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                    {/* <img className='img-fluid mt-3 rounded' alt='Beautiful scenery' src={heroImage} /> */}
                </Col>
                <Col className='my-5 mx-auto' xs={12}>
                    <h2 className='mt-3 text-center font-setting'>
                        All Your Spots At A Glance
                    </h2>
                    <HomeMap className='mt-5' />
                </Col>
            </Row>
        </Container>


    )
};

export default AddLocationsPage;