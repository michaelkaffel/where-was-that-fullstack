import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { selectRandomCampsite } from "../features/campsites/campsitesSlice";
import { selectRandomHike } from '../features/hikes/hikesSlice';
import { selectRandomOverlook } from '../features/overlooks/overlooksSlice';
import { useSelector } from "react-redux";
import PreviewCard from './PreviewCard';

const PreviewDisplay = () => {
    const items = useSelector((state) => [
        selectRandomCampsite(state),
        selectRandomHike(state),
        selectRandomOverlook(state)
    ]);



    const [campsite, hike, overlook] = items

 

    let hikeContent = null;
    let campContent = null;
    let overlookContent = null;
    if (!hike) {
        hikeContent = <h4 className='text-center mt-3'>Add some hikes!</h4>
    } else hikeContent = <PreviewCard item={hike} />

    if (!campsite) {
        campContent = <h4 className='text-center mt-3'>Add some campsites!</h4>
    } else campContent = <PreviewCard item={campsite} />

    if (!overlook) {
        overlookContent = <h4 className='text-center mt-3'>Add some lookouts!</h4>
    } else overlookContent = <PreviewCard item={overlook} />

    return (
        <>
            
            <Container>
                
                <Row>
                     <Col md='4'>
                        {hikeContent}
                        
                    </Col>

                    <Col md='4'>
                        
                        {campContent}
                    </Col>
                   
                    <Col md='4'>
                        
                        {overlookContent}
                    </Col>

                </Row>
            </Container>


        </>
    )
}

export default PreviewDisplay;

