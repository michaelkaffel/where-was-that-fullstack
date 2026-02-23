import { useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { deleteOverlook, patchFavOverlook } from './overlooksSlice';
import { deleteAllOverlooksComments } from './overlooksCommentsSlice';
import overlookPlaceHolderImg from '../../app/images/overlookPlaceholder.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';



library.add(fas, far)

const OverlookCard = ({ overlook }) => {

    const dispatch = useDispatch();

    const { id, image, title, description, location, favorite } = overlook;
    let imageInsert;
    
    if (!image || image === "http://localhost:3001/null") {
        imageInsert = overlookPlaceHolderImg   
    } else imageInsert = image

    let favoriteButton;

    if (favorite) {
        favoriteButton = favoriteButton = <FontAwesomeIcon 
                            onClick={() => dispatch(
                                                patchFavOverlook(overlook)
                                        )}
                            icon="fa-solid fa-heart" 
                            size="xl" 
                            color='red'
                            className='pointer-effect'
                        />
    } else {
        favoriteButton = <FontAwesomeIcon 
                            onClick={() => dispatch(
                                                patchFavOverlook(overlook)
                                )}
                                icon="fa-regular fa-heart" 
                                size="xl" 
                                color='red'
                                className='pointer-effect'
                            />
    }

    return (
        <Card className='m-3'>
            <Card.Img variant='top' alt="Sample" src={imageInsert}/>
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
                                dispatch(deleteOverlook(overlook.id));
                                dispatch(deleteAllOverlooksComments(overlook.id))
                            }}
                            />
                    </div>
                </div>
            </Card.Body>
        </Card>
    )
};

export default OverlookCard;