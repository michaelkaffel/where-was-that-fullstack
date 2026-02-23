import Container from 'react-bootstrap/Container';
import HikingTrailsDisplay from '../features/hikes/HikingTrailsDisplay';
import SubHeaderHikes from '../components/SubHeaderHikes';
import AccordionForHikeForm from '../features/hikes/AccordionForHikeForm';



const HikingTrailsPage = () => {


    return (
        <>
            <Container>
                <SubHeaderHikes current='Hiking Trails'/>
                
                <h2 className='text-center'>Hiking Trails</h2>
                <AccordionForHikeForm />
                
                <HikingTrailsDisplay />
            </Container>
        </>
    )
};

export default HikingTrailsPage;