import Container from 'react-bootstrap/Container';
import SubHeader from '../components/SubHeader';
import AccordionForPlaceForm from '../features/places/AccordionForPlaceForm';
import PlacesDisplay from '../features/places/PlacesDisplay';
import overlookPlaceholder from '../app/images/overlookPlaceholder.png'

const OverlooksPage = () => {
    return (
            <Container>
                <SubHeader current='Scenic Overlooks' listPath='/scenic-overlooks' listLabel='Scenic Overlooks'/>
                <h2 className='text-center'>Scenic Overlooks</h2>
                <AccordionForPlaceForm 
                    kindOfPlace='overlook'
                    headerLabel='Add Overlooks'
                    titlePlaceholder='Name of your overlook...'
                    descriptionPlaceholder='Describe your overlook...'
                    submitLabel='Add Overlook!'
                />
                <PlacesDisplay 
                    kindOfPlace='overlook'
                    allLabel='All Overlooks'
                    detailPath='/scenic-overlooks'
                    placeholder={overlookPlaceholder}
                    emptyMessage='Add some overlooks!'
                    emptyFavsMessage='Favorite some overlooks!'
                />
            </Container>
    );
};

export default OverlooksPage;