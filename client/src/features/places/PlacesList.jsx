import { useSelector } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import { selectPlacesByType } from './placesSlice';
import PlaceCard from './PlaceCard';

const PlacesList = ({ kindOfPlace, detailPath, placeholder, emptyMessage }) => {
    const places = useSelector(selectPlacesByType(kindOfPlace));

    return (
        <Row >
            {places && places.length > 0 ? (
                places.map((place) => (
                    <Col className='mt-2' key={place.id} xs={12} sm={12} md={6} lg={6}>
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

export default PlacesList;