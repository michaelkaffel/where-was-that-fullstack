import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import PlacesList from './PlacesList';
import FavsList from './FavsList';

const PlacesDisplay = ({ kindOfPlace, allLabel, detailPath, placeholder, emptyMessage, emptyFavsMessage}) => {
    return (
        <Tab.Container defaultActiveKey='first'>
            <Row>
                <Col className='mt-3' sm={3}>
                    <Nav variant='pills' className='flex-column'>
                        <Nav.Item>
                            <Nav.Link eventKey='first'>{allLabel}</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey='second'>Favorites</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Col>
                <Col sm={9}>
                    <Tab.Content>
                        <Tab.Pane eventKey='first'>
                            <PlacesList 
                                kindOfPlace={kindOfPlace}
                                detailPath={detailPath}
                                placeholder={placeholder}
                                emptyMessage={emptyMessage}
                            />
                        </Tab.Pane>
                        <Tab.Pane eventKey='second'>
                            <FavsList 
                                kindOfPlace={kindOfPlace}
                                detailPath={detailPath}
                                placeholder={placeholder}
                                emptyMessage={emptyFavsMessage}
                            />
                        </Tab.Pane>
                    </Tab.Content>
                </Col>
            </Row>
        </Tab.Container>
    );
};

export default PlacesDisplay;