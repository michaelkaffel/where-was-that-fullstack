import Container from 'react-bootstrap/Container';
import SubHeader from '../components/SubHeader';
import AccordionForPlaceForm from '../features/places/AccordionForPlaceForm';
import PlacesDisplay from '../features/places/PlacesDisplay';
import hikesPlaceholder from '../app/images/hikesPlaceholder.png'



const HikingTrailsPage = () => {


    return (
        <>
            <Container>
                <SubHeader current='Hiking Trails' listPath='/hiking-trails' listLabel='Hiking Trails'/>
                <h2 className='text-center'>Hiking Trails</h2>
                <AccordionForPlaceForm
                    kindOfPlace='hike'
                    headerLabel='Add Hikes'
                    titlePlaceholder='Name of your hike...'
                    descriptionPlaceholder='Describe your hike...'
                    submitLabel='Add Hike!'
                />
                <PlacesDisplay
                    kindOfPlace='hike'
                    allLabel='All Hikes'
                    detailPath='/hiking-trails'
                    placeholder={hikesPlaceholder}
                    emptyMessage='Add some hikes!'
                    emptyFavsMessage='Favorite some hikes!'
                />
            </Container>
        </>
    )
};

export default HikingTrailsPage;