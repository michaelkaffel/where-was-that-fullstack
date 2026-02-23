import { useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { deleteHike, patchFavHike } from './hikesSlice';
import { deleteAllHikesComments } from './hikesCommentsSlice';
import hikePlaceHolderImg from '../../app/images/hikesPlaceholder.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';


library.add(fas, far)

const HikeCard = ({ hike }) => {

    const dispatch = useDispatch();

    const { id, image, title, description, location, favorite } = hike;
    let imageInsert;

    if (!image || image === 'http://localhost:3001/null') {
        imageInsert = hikePlaceHolderImg
    } else imageInsert = image

    let favoriteButton;

    if (favorite) {
        favoriteButton = <FontAwesomeIcon
            onClick={() => dispatch(
                patchFavHike(hike)
            )}
            icon="fa-solid fa-heart"
            size="xl"
            color='red'
            className='pointer-effect'
        />
    } else {
        favoriteButton = <FontAwesomeIcon
            onClick={() => dispatch(
                patchFavHike(hike)
            )}
            icon="fa-regular fa-heart"
            size="xl"
            color='red'
            className='pointer-effect'
        />
    }

    return (
        <Card className='m-3'>
            <Card.Img variant='top' alt="Sample" src={imageInsert} />
            <Card.Body>
                <Card.Title tag="h2">{title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted" tag="h6">
                    {location}
                </Card.Subtitle>
                <Card.Text>{description}</Card.Text>
                <div className='d-flex justify-content-between align-items-center'>
                    <Link to={`${id}`}>
                        <Button>
                            Details
                        </Button>
                    </Link>
                    <div>
                        {favoriteButton}
                        <FontAwesomeIcon
                            icon='fa-solid fa-trash-can'
                            size='xl'
                            className='pointer-effect'
                            onClick={() => {
                                dispatch(deleteHike(hike.id));
                                dispatch(deleteAllHikesComments(hike.id))
                            }}
                        />
                    </div>
                </div>
            </Card.Body>
        </Card>
    )
};

export default HikeCard;