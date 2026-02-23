import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Link } from 'react-router-dom';

const SubHeaderCampsites = ({ current, detail }) => {
    return (
        <Row>
            <Col>
                <Breadcrumb>
                    <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
                        Home
                    </Breadcrumb.Item>
                    {detail && (
                        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/camping-spots" }}>
                            Camping Spots
                        </Breadcrumb.Item>
                    )}
                    <Breadcrumb.Item active>{current}</Breadcrumb.Item>
                </Breadcrumb>
                <hr />
            </Col>
        </Row>
    );
};

export default SubHeaderCampsites;