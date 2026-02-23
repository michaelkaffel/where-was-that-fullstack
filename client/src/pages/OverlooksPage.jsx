import Container from 'react-bootstrap/Container';
import OverlooksDisplay from '../features/overlooks/OverlooksDisplay';
import SubHeaderOverlooks from '../components/SubHeaderOverlooks';
import AccordionForOverlookForm from '../features/overlooks/AccordionForOverlookForm';

const OverlooksPage = () => {
    return (
        <>
            <Container>
                <SubHeaderOverlooks current='Scenic Overlooks' />
                <h2 className='text-center'>Scenic Overlooks</h2>
                <AccordionForOverlookForm />
                <OverlooksDisplay />
            </Container>
        </>
    )
};

export default OverlooksPage;