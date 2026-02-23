// import { Card, Card.Body, Card.Title, Card.Subtitle, Card.Text, Button } from 'reactstrap';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'
import hikePlaceholderImg from '../app/images/hikesPlaceholder.png';
import campsitePlaceholderImg from '../app/images/campsitesPlaceholder.png';
import overlookPlaceholderImg from '../app/images/overlookPlaceholder.png'



const ItemCard = ({ item }) => {
    const { id, image, title, description, location } = item
     let imageInsert;

    if (!image) {
        switch(kindOfPlace) {
            case 'campsite':
                imageInsert = campsitePlaceholderImg;
                break;
            case 'hike':
                imageInsert = hikePlaceholderImg;
                break;
            case 'overlook':
                imageInsert = overlookPlaceholderImg;
                break;
            default:
        }   
    } else imageInsert = image

    return (
        <Card className='m-3'>
            <Card.Img variant='top' alt={title} src={imageInsert}/>
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
                    {/* <div>
                        <i className="fa-regular fa-heart fa-xl"></i>
                        <i className="fa-solid fa-trash-can fa-xl"></i>
                    </div> */}
                </div>
            </Card.Body>
        </Card>
    )
};

export default ItemCard;

