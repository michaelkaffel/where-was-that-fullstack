import Col from 'react-bootstrap/Col';
import LoadingSpinner from '../components/LoadingSpinner'

const Loading = () => {
    return (
        <Col>
            <LoadingSpinner />
            <p className='text-center mt-3'>Loading...</p>
        </Col>
    );
};

export default Loading;