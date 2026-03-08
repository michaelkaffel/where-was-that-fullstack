import { useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { deletePlace, patchFavorite } from './placesSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

library.add(fas, far);

const PlaceCard = ({ place, detailPath, placeholder }) => {
    const dispatch = useDispatch();
    const { id, imageUrl, title, description, location, favorite } = place;

    const imageSrc = imageUrl || placeholder;

    return (
        <Card className='m-3'>
            <Card.Img 
                variant='top'
                alt={title}
                src={imageSrc}
            />
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Subtitle className='mb-2 text-muted'>
                    {location}
                </Card.Subtitle>
                <Card.Text>{description}</Card.Text>
                <div className='d-flex justify-content-between align-items-center'>
                    <Link to={`${detailPath}/${id}`}>
                        <Button>Details</Button>
                    </Link>
                    <div className='d-flex gap-3 align-items-center'>
                        <FontAwesomeIcon 
                            onClick={() => dispatch(patchFavorite({ placeId: id, favorite: !favorite }))}
                            icon={favorite ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}
                            size='xl'
                            color='red'
                            style={{ cursor: 'pointer' }}
                        />
                        <FontAwesomeIcon 
                            icon='fa-solid fa-trash-can'
                            size='xl'
                            style={{ cursor: 'pointer' }}
                            onClick={() => dispatch(deletePlace(id))}
                        />
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default PlaceCard;