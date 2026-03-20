import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectPlacesByType, selectFavoritePlacesByType } from '../features/places/placesSlice';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';




delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const FitBounds = ({ places }) => {
    const map = useMap();
    useEffect(() => {
        if (places.length > 0) {
            const bounds = L.latLngBounds(places.map(p => [p.location.lat, p.location.lng]));
            map.fitBounds(bounds, { padding: [30, 30] });
        }
    }, [places, map])
    return null;
}

const CategoryMap = ({ kindOfPlace, detailPath, favoritesOnly = false  }) => {

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
            <FitBounds places ={validPlaces} />
            {validPlaces.map(place => (
                <Marker key={place.id} position={[place.location.lat, place.location.lng]}>
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