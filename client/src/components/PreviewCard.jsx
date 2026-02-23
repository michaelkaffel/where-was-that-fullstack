
import Card from 'react-bootstrap/Card';
import hikePlaceholderImg from '../app/images/hikesPlaceholder.png';
import campsitePlaceholderImg from '../app/images/campsitesPlaceholder.png';
import overlookPlaceholderImg from '../app/images/overlookPlaceholder.png'


const PreviewCard = ({ item }) => {
    const { image, title, description, location, kindOfPlace } = item

    let imageInsert;

    if (!image || image === "http://localhost:3001/null") {
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
            </Card.Body>
        </Card>
    )
};

export default PreviewCard;

