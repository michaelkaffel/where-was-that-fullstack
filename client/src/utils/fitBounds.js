import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

const FitBounds = ({ places }) => {
    const map = useMap();
    useEffect(() => {
        if (places.length > 0) {
            const bounds = L.latLngBounds(places.map(p => [p.location.lat, p.location.lng]));
            map.fitBounds(bounds, { padding: [30, 30] });
        }
    }, [places, map]);
    return null;
};

export default FitBounds;