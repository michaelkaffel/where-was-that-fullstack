import { useSelector } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import OverlookCard from './OverlookCard';
import { selectFavoriteOverlooks } from './overlooksSlice';
import Error from '../../components/Error';
import Loading from '../../components/Loading';

const OverlooksFavList = () => {
    const overlooks = useSelector(selectFavoriteOverlooks);
    const isLoading = useSelector((state) => state.overlooks.isLoading);
    const errMsg = useSelector((state) => state.overlooks.errMsg);

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

    if (overlooks.length === 0) {
        return (
            <h4 className='text-center my-5' >Favorite more overlooks</h4>
        )
    }

    return (
        <Row className='mx-auto'>
            {overlooks.map((overlook) => {
                return (
                    <Col
                        lg='4'
                        key={overlook.id}
                    >
                        <OverlookCard overlook={overlook} />
                    </Col>
                )
            })}
        </Row>
    )
}

export default OverlooksFavList;