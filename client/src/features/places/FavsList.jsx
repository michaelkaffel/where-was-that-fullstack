import { useSelector } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { selectFavoritePlacesByType } from './placesSlice';
import PlaceCard from './PlaceCard';

const FavsList = ({ kindOfPlace, detailPath, placeholder, emptyMessage }) => {
    const favs = useSelector(selectFavoritePlacesByType(kindOfPlace));

    return (
        <Row>
            {favs && favs.length > 0 ? (
                favs.map((place) => (
                    <Col key={place.id} sm={6} md={6} lg={3}>
                        <PlaceCard
                            place={place}
                            detailPath={detailPath}
                            placeholder={placeholder}
                        />
                    </Col>
                ))
            ) : (
                <p className='text-center'>{emptyMessage}</p>
            )}
        </Row>
    );
};

export default FavsList;