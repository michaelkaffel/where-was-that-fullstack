import { useSelector } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import HikeCard from './HikeCard';
import { selectAllHikes } from './hikesSlice';
import Error from '../../components/Error';
import Loading from '../../components/Loading';

const HikesList = () => {
    const hikes = useSelector(selectAllHikes);
    const isLoading = useSelector((state) => state.hikes.isLoading);
    const errMsg = useSelector((state) => state.hikes.errMsg);

    if (isLoading) {
        return (
            <Row>
                <Loading />
            </Row>
        );
    };

    if (errMsg) {
        return (
            <Row>
                <Error errMsg={errMsg} />
            </Row>
        );
    };

    if (hikes.length === 0) {
        return (
            <h4 className='text-center my-5'>Add some hikes!</h4>
        )
    }

    return (
        <Row className='mx-auto'>
            {hikes.map((hike) => {
                return (
                    <Col
                        lg='4'
                        key={hike.key || hike.id}
                    >
                        <HikeCard hike={hike} />
                    </Col>
                )
            }
        )}
        </Row>
    )
};

export default HikesList;