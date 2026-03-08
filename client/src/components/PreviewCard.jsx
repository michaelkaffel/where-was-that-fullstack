
import Card from 'react-bootstrap/Card';
import hikePlaceholderImg from '../app/images/hikesPlaceholder.png';
import campsitePlaceholderImg from '../app/images/campsitesPlaceholder.png';
import overlookPlaceholderImg from '../app/images/overlookPlaceholder.png'


const PreviewCard = ({ item }) => {
    const { imageUrl, title, description, location, kindOfPlace } = item

    let imageSrc;

    if (!imageUrl) {
        switch(kindOfPlace) {
            case 'campsite':
                imageSrc = campsitePlaceholderImg;
                break;
            case 'hike':
                imageSrc = hikePlaceholderImg;
                break;
            case 'overlook':
                imageSrc = overlookPlaceholderImg;
                break;
            default:
                imageSrc = campsitePlaceholderImg;
        }   
    } else imageSrc = imageUrl

    return (
        <Card className='m-3'>
            <Card.Img variant='top' alt={title} src={imageSrc}/>
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

