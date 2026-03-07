import { useSelector } from 'react-redux';
import Row from 'react-bootstrap/Row';
import { selectPlacesByType } from './placesSlice';
import PlaceCard from './PlaceCard';

const PlacesList = ({ kindOfPlace, detailPath, placeholder, emptyMessage }) => {
    const places = useSelector(selectPlacesByType(kindOfPlace));

    return (
        <Row>
            {places && places.length > 0 ? (
                places.map((place) => (
                    <PlaceCard 
                        key={place.id}
                        place={place}
                        detailPath={detailPath}
                        placeholder={placeholder}
                    />
                ))
            ) : (
                <p className='text-center'>{emptyMessage}</p>
            )}
        </Row>
    );
};

export default PlacesList;