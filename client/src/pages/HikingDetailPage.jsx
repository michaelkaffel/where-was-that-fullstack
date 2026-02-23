import { useSelector } from 'react-redux';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { useParams } from 'react-router-dom';
import { selectHikeById } from '../features/hikes/hikesSlice';
import ItemDetails from '../components/ItemDetails';
import SubHeader from '../components/SubHeaderHikes';
import HikesCommentsList from '../features/hikes/HikesCommentsList';
import Error from '../components/Error';
import Loading from '../components/Loading';

const HikingDetailPage = () => {

    const { id } = useParams();
    const hike = useSelector(selectHikeById(id));
    
    const isLoading = useSelector((state) => state.hikes.isLoading);
    const errMsg = useSelector((state) => state.hikes.errMsg);
    let content = null;

    if (isLoading) {
        content = <Loading />
    } else if (errMsg) {
        content = <Error errMsg={errMsg} />
    } else {
        content = (
            <>
                <h2 className='text-center'>{hike.title}</h2>
                <Card>
                    <ItemDetails item={hike} />
                    <Card.Footer>
                        <HikesCommentsList hikeId={id} />
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
                        {hike && <SubHeader current={hike.title} detail={true} />}
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

export default HikingDetailPage;