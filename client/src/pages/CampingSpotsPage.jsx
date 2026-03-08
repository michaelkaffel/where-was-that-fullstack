import Container from 'react-bootstrap/Container';
import SubHeader from '../components/SubHeader';
import AccordionForPlaceForm from '../features/places/AccordionForPlaceForm';
import PlacesDisplay from '../features/places/PlacesDisplay';
import campsitesPlaceholder from '../app/images/campsitesPlaceholder.png'


const CampingSpotsPage = () => {
    return (
        <>
            <Container>
                <SubHeader current='Camping Spots' listPath='/camping-spots' listLabel='Camping Spots'/>
                <h2 className='text-center'>Camping Spots</h2>
                <AccordionForPlaceForm 
                    kindOfPlace='campsite'
                    headerLabel='Add Campsite'
                    titlePlaceholder='Name of your campground...'
                    descriptionPlaceholder='Describe your campsite...'
                    submitLabel='Add Campsite!'
                />
                <PlacesDisplay 
                    kindOfPlace='campsite'
                    allLabel='All Campsites'
                    detailPath='/camping-spots'
                    placeholder={campsitesPlaceholder}
                    emptyMessage='Add some campsites!'
                    emptyFavsMessage='Favorite some campsites!'
                />
            </Container>
        </>
    )
};

export default CampingSpotsPage;