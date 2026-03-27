
import { useSelector } from 'react-redux';
import { selectPlacesByType, selectFavoritePlacesByType } from '../features/places/placesSlice';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import FitBounds from '../utils/fitBounds';

const markerSvg = (color) => encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36">
        <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="${color}" stroke="#333" stroke-width="1"/>
        <circle cx="12" cy="12" r="5" fill="white"/>
    </svg>
    `);

const icons = {
    hike: L.icon({
        iconUrl: `data:image/svg+xml,${markerSvg('#2d6a4f')}`,
        iconSize: [28, 42],
        iconAnchor: [14, 42],
        popupAnchor: [0, -42]
    }),
    campsite: L.icon({
        iconUrl: `data:image/svg+xml,${markerSvg('#e76f51')}`,
        iconSize: [28, 42],
        iconAnchor: [14, 42],
        popupAnchor: [0, -42]
    }),
    overlook: L.icon({
        iconUrl: `data:image/svg+xml,${markerSvg('#457b9d')}`,
        iconSize: [28, 42],
        iconAnchor: [14, 42],
        popupAnchor: [0, -42]
    })
}

const CategoryMap = ({ kindOfPlace, detailPath, favoritesOnly = false }) => {

    const allPlaces = useSelector(selectPlacesByType(kindOfPlace));
    const favPlaces = useSelector(selectFavoritePlacesByType(kindOfPlace))
    const places = favoritesOnly ? favPlaces : allPlaces;

    const validPlaces = places.filter(p => p.location?.lat && p.location?.lng);

    if (validPlaces.length === 0) return null;

    // const avgLat = validPlaces.reduce((sum, p) => sum + p.location.lat, 0) / validPlaces.length;
    // const avgLng = validPlaces.reduce((sum, p) => sum + p.location.lng, 0) / validPlaces.length;

    return (
        <MapContainer
            center={[0, 0]}
            zoom={9}
            style={{ height: '350px', width: '100%' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            <FitBounds places={validPlaces} />
            {validPlaces.map(place => (
                <Marker key={place.id} position={[place.location.lat, place.location.lng]} icon={icons[kindOfPlace]}>
                    <Popup>
                        <strong>{place.title}</strong>
                        <br />
                        <Link to={`${detailPath}/${place.id}`}>See more details</Link>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default CategoryMap;