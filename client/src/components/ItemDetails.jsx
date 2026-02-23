
import Card from 'react-bootstrap/Card';
import hikePlaceholderImg from '../app/images/hikesPlaceholder.png';
import campsitePlaceholderImg from '../app/images/campsitesPlaceholder.png';
import overlookPlaceholderImg from '../app/images/overlookPlaceholder.png'

const ItemDetails = ({ item }) => {
    const { image, description, location, title, kindOfPlace, dateVisited } = item;

    const formattedDate = new Date(dateVisited).toLocaleDateString();

        let imageInsert;

    if (!image || image === "http://localhost:3001/null") {
        switch (kindOfPlace) {
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
        <>
            <Card.Img variant='top' alt={title} src={imageInsert} />
            <Card.Body>

                <Card.Text>
                    {description}
                </Card.Text>
                <div className='d-flex justify-content-between'>
                    <Card.Title className='text-start'>
                        {location}
                    </Card.Title>
                    <div className='d-flex'>
                        <Card.Text className='me-2 fw-bold'>First Visit: </Card.Text>
                        <Card.Text className='fw-bold'>{formattedDate}</Card.Text>
                    </div>
                </div>
            </Card.Body>
        </>
    )
}

export default ItemDetails;

