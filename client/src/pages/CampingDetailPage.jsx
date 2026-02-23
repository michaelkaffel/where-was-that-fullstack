import { useSelector } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { useParams } from 'react-router-dom';
import { selectCampsiteById } from '../features/campsites/campsitesSlice';
import ItemDetails from '../components/ItemDetails';
import SubHeaderCampsites from '../components/SubHeaderCampsites';
import CampsitesCommentsList from '../features/campsites/CampsitesCommentsList';
import Error from '../components/Error';
import Loading from '../components/Loading';


const CampingDetailPage = () => {

    const { id } = useParams();
    const campsite = useSelector(selectCampsiteById(id));
    

    const isLoading = useSelector((state) => state.campsites.isLoading);
    const errMsg = useSelector((state) => state.campsites.errMsg);
    let content = null;

    if (isLoading) {
        content = <Loading />
    } else if (errMsg) {
        content = <Error errMsg={errMsg} />
    } else {
        content = (
            <>
                <h2 className='text-center'>{campsite.title}</h2>
                <Card>
                    <ItemDetails item={campsite} />
                    <Card.Footer>
                        <CampsitesCommentsList campsiteId={id} />
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
                        {campsite && <SubHeaderCampsites current={campsite.title} detail={true} />}
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

export default CampingDetailPage;