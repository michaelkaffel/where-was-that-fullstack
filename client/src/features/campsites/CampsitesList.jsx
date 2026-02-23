import { useSelector } from "react-redux";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CampsiteCard from "./CampsiteCard";
import { selectAllCampsites } from "./campsitesSlice";
import Error from "../../components/Error";
import Loading from "../../components/Loading";

const CampsitesList = () => {
    
    const campsites = useSelector(selectAllCampsites);
    const isLoading = useSelector((state) => state.campsites.isLoading);
    const errMsg = useSelector((state) => state.campsites.errMsg);

    if (isLoading) {
        return (
            <Row>
                <Loading/>
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

    if (campsites.length === 0) {
        return(
            <h4 className='text-center my-5'>Add some campsites!</h4>
        )
    }

    return (
        <Row className='mx-auto'>
            {campsites.map((campsite) => {
                return (
                    <Col
                        lg='4'
                        key={campsite.id}
                    >
                        <CampsiteCard campsite={campsite} />
                    </Col>
                )
            })}
        </Row>
       
    )
};

export default CampsitesList;