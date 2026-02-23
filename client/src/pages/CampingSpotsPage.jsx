import Container from 'react-bootstrap/Container';
import SubHeaderCampsites from '../components/SubHeaderCampsites';
import AccordionForCampsiteForm from '../features/campsites/AccordionForCampsiteForm';
import CampsitesDisplay from '../features/campsites/CampsitesDisplay';


const CampingSpotsPage = () => {
    return (
        <>
            <Container>
                <SubHeaderCampsites current='Camping Spots'/>
                <h2 className='text-center'>Camping Spots</h2>
                <AccordionForCampsiteForm />
                <CampsitesDisplay />
            </Container>
        </>
    )
};

export default CampingSpotsPage;