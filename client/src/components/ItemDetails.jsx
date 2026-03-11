import Card from 'react-bootstrap/Card';
import hikePlaceholderImg from '../app/images/hikesPlaceholder.png';
import campsitePlaceholderImg from '../app/images/campsitesPlaceholder.png';
import overlookPlaceholderImg from '../app/images/overlookPlaceholder.png';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

const ItemDetails = ({ item }) => {
    const { imageUrl, description, location, title, kindOfPlace, dateVisited } = item;

    const formattedDate = new Date(dateVisited).toLocaleDateString();
    const hasCoordinates = location?.lat && location?.lng

        let imageInsert;

    if (!imageUrl || imageUrl === "http://localhost:3001/null") {
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
    } else imageInsert = imageUrl

    return (
        <>
            <Card.Img variant='top' alt={title} src={imageInsert} />
            <Card.Body>

                <Card.Text>
                    {description}
                </Card.Text>
                <hr/>
                <div className='d-flex justify-content-between'>
                    <Card.Title className='text-start'>
                        {location?.name}
                    </Card.Title>
                    <div className='d-flex'>
                        <Card.Text className='me-2 fw-bold'>First Visit: </Card.Text>
                        <Card.Text className='fw-bold'>{formattedDate}</Card.Text>
                    </div>
                </div>
                {hasCoordinates && (
                    <div className='mt-3'>
                        
                        <MapContainer
                            center={[location.lat, location.lng]}
                            zoom={12}
                            style={{ height: '300px', width: '100%', borderRadius: '8px' }}
                            scrollWheelZoom={false}
                        >
                            <TileLayer 
                                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                                attribution='© OpenStreetMap contributors'
                            />
                            <Marker position={[location.lat, location.lng]}>
                                <Popup>{location.name || title}</Popup>
                            </Marker>
                        </MapContainer>

                        
                            
                        <a
                            href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='btn btn-outline-secondary btn-sm mt-2'
                        >
                            Open in Google Maps
                        </a>
                    </div>
                )}
            </Card.Body>
        </>
    )
}

export default ItemDetails;

