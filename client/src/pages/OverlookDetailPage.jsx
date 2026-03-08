import { useSelector } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { useParams } from 'react-router-dom';
import { selectPlaceById, selectPlacesLoading, selectPlacesError } from '../features/places/placesSlice';
import ItemDetails from '../components/ItemDetails';
import SubHeader from '../components/SubHeader';
import NotesList from '../features/places/NotesList';
import Error from '../components/Error';
import Loading from '../components/Loading';

const OverlookDetailPage = () => {

    const { id } = useParams();
    const overlook = useSelector(selectPlaceById(id));
    const isLoading = useSelector(selectPlacesLoading);
    const errMsg = useSelector(selectPlacesError);

    let content = null;

    if (isLoading) {
        content = <Loading />
    } else if (errMsg) {
        content = <Error errMsg={errMsg} />
    } else if (overlook) {
        content = (
            <>
                <h2 className='text-center'>{overlook.title}</h2>
                <Card>
                    <ItemDetails item={overlook} />
                    <Card.Footer>
                        <NotesList placeId={id} />
                    </Card.Footer>
                </Card>
            </>
        )
    }

    return (
        <>
            <Container>
                <Row>
                    <Col>
                        {overlook && (
                            <SubHeader
                                current={overlook.title}
                                listPath='/scenic-overlooks'
                                listLabel='Scenic Overlooks'
                                detail={true}
                            />
                        )}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {content}
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default OverlookDetailPage;