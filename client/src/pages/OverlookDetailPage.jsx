import { useSelector } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { useParams } from 'react-router-dom';
import { selectOverlooksById } from '../features/overlooks/overlooksSlice';
import ItemDetails from '../components/ItemDetails';
import SubHeaderOverlooks from '../components/SubHeaderOverlooks';
import OverlooksCommentsList from '../features/overlooks/OverlooksCommentsList';
import Error from '../components/Error';
import Loading from '../components/Loading';

const OverlookDetailPage = () => {

    const { id } = useParams();
    const overlook = useSelector(selectOverlooksById(id));

    const isLoading = useSelector((state) => state.overlooks.isLoading);
    const errMsg = useSelector((state) => state.overlooks.errMsg);
    let content = null;

    if (isLoading) {
        content = <Loading />
    } else if (errMsg) {
        content = <Error errMsg={errMsg} />
    } else {
        content = (
            <>
                <h2 className='text-center'>{overlook.title}</h2>
                        <Card>
                            <ItemDetails item={overlook} />
                            <Card.Footer>
                                <OverlooksCommentsList overlookId={id} />
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
                        {overlook && <SubHeaderOverlooks current={overlook.title} detail={true} />}
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