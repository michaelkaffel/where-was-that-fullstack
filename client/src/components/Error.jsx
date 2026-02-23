import Col from 'react-bootstrap/Col';

const Error = ({ errMsg }) => {
    return (
        <Col>
            <h4>{errMsg}</h4>
        </Col>
    );
};

export default Error;