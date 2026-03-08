import { useSelector } from 'react-redux';
import Row from 'react-bootstrap/Row';
import { selectFavoritePlacesByType } from './placesSlice';
import PlaceCard from './PlaceCard';

const FavsList = ({ kindOfPlace, detailPath, placeholder, emptyMessage}) => {
    const favs = useSelector(selectFavoritePlacesByType(kindOfPlace));

    return (
        <Row>
            {favs && favs.length > 0 ? (
                favs.map((place) => (
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

export default FavsList;