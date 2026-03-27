import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import { Formik, Field, Form as FForm, ErrorMessage } from 'formik';
import { validateForm } from '../../utils/validateForm';
import { processImage16x9 } from '../../utils/processImage16x9';
import { postPlace, selectPlacesLoading } from './placesSlice';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const LocationPicker = ({ position, setPosition }) => {
    useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng])
        }
    });
    return position ? <Marker position={position} /> : null;
}

const MapController = ({ flyTo }) => {
    const map = useMap();

    useEffect(() => {
        const container = map.getContainer();
        const observer = new ResizeObserver(() => {
            map.invalidateSize();
        });
        observer.observe(container);
        return () => observer.disconnect();
    }, [map]);

    useEffect(() => {
        if (flyTo) {
            map.invalidateSize();
            map.flyTo(flyTo, 12);
        } else {
            map.flyTo([47.5, -120.5], 6)
        }
    }, [flyTo, map]);
    return null;
}

const AddPlaceForm = ({ kindOfPlace, titlePlaceholder, descriptionPlaceholder, submitLabel }) => {
    const dispatch = useDispatch();
    const loading = useSelector(selectPlacesLoading);
    const [mapPosition, setMapPosition] = useState(null);
    const [geoError, setGeoError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState(null);
    const fileInputRef = useRef(null);

    const handleSubmit = async (values, { resetForm }) => {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('location[name]', values.location.name);
        formData.append('location[lat]', values.location.lat ?? '');
        formData.append('location[lng]', values.location.lng ?? '');
        formData.append('dateVisited', values.dateVisited);
        formData.append('kindOfPlace', kindOfPlace);
        formData.append('favorite', false);

        if (values.image) {
            formData.append('image', values.image, 'image.jpg');
        }

        dispatch(postPlace(formData));
        resetForm();
        setMapPosition(null);
    };

    const handleMapClick = (coords, setFieldValue) => {
        setMapPosition(coords);
        setFieldValue('location.lat', coords[0]);
        setFieldValue('location.lng', coords[1]);
    }

    const handleFindMyLocation = (setFieldValue, values) => {
        setGeoError(null);
        if (!navigator.geolocation) {
            setGeoError('Geolocation is not supported by your browser');
            return
        }
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setMapPosition([latitude, longitude]);
                setFieldValue('location.lat', latitude);
                setFieldValue('location.lng', longitude);

                if (!values.location.name) {
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                        );
                        const data = await response.json();
                        const name = data.address?.city || data.address?.town || data.address?.village;
                        if (name) setFieldValue('location.name', name);
                    } catch {

                    }
                }
            },
            () => setGeoError('Unable to retrieve your location')
        );
    };

    const handleSearch = async (setFieldValue, values) => {
        if (!searchQuery.trim()) return;
        setSearchLoading(true);
        setSearchError(null);

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`
            );
            const data = await response.json();
            if (!data.length) {
                setSearchError('No results found. Try a different search');
                return;
            }
            const { lat, lon, address } = data[0];
            const coords = [parseFloat(lat), parseFloat(lon)];
            setMapPosition(coords);
            setFieldValue('location.lat', coords[0]);
            setFieldValue('location.lng', coords[1]);

            if (!values.location.name) {
                const name = address?.city || address?.town || address?.village || data[0].display_name.split(',')[0];
                if (name) setFieldValue('location.name', name);
            }
        } catch {
            setSearchError('Search failed. Please try again or drop a pin manually');
        } finally {
            setSearchLoading(false);
        }
    };



    return (
        <Formik
            initialValues={{
                title: '',
                description: '',
                image: null,
                location: { name: '', lat: null, lng: null },
                dateVisited: '',
            }}
            onSubmit={handleSubmit}
            validate={validateForm}
        >
            {({ setFieldValue, values, errors, submitCount }) => (
                <FForm>
                    <Form.Group>
                        <Form.Label htmlFor='title'>Title</Form.Label>
                        <Field name='title' placeholder={titlePlaceholder} className='form-control' />
                        <ErrorMessage name='title'>
                            {(msg) => <p className='text-danger'>{msg}</p>}
                        </ErrorMessage>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label htmlFor='location.name'>Location</Form.Label>
                        <Field name='location.name' placeholder='Ex: City, State' className='form-control' />
                        <ErrorMessage name='location.name'>
                            {(msg) => <p className='text-danger'>{msg}</p>}
                        </ErrorMessage>
                    </Form.Group>

                    {/* Map Toggle */}
                    <Form.Group className='my-3'>
                        <Form.Label>Pin Location</Form.Label>
                        <div className='d-flex gap-2 my-2'>
                            <Form.Control
                                size='sm'
                                type='text'
                                placeholder='Search for a place...'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleSearch(setFieldValue, values)
                                    }
                                }}
                            />
                            <Button
                                variant='outline-secondary'
                                size='sm'
                                type='button'
                                className='mb-2'
                                onClick={() => handleSearch(setFieldValue, values)}
                                disabled={searchLoading}
                            >
                                {searchLoading ? <Spinner as='span' animation='border' size='sm' /> : 'Search'}
                            </Button>
                        </div>
                        {searchError && <p className='text-danger small'>{searchError}</p>}

                        <Button
                                variant='outline-primary'
                                size='sm'
                                type='button'
                                className='mb-2'
                                onClick={() => handleFindMyLocation(setFieldValue, values)}
                            >
                                Find My Location
                            </Button>
                        {geoError && <p className='text-danger small'>{geoError}</p>}
                        {mapPosition && (
                            <p className='text-muted small'>
                                Pin: {mapPosition[0].toFixed(4)}, {mapPosition[1].toFixed(4)}
                            </p>
                        )}

                        {submitCount > 0 && errors.location?.lat && (
                            <p className='text-danger'>{errors.location.lat}</p>
                        )}

                        <MapContainer
                            center={mapPosition || [47.5, -120.5]}
                            zoom={mapPosition ? 12 : 6}
                            style={{ height: '300px', width: '100%', borderRadius: '8px' }}
                        >
                            <TileLayer
                                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                                attribution='© OpenStreetMap contributors'
                            />
                            <MapController flyTo={mapPosition} />
                            <LocationPicker
                                position={mapPosition}
                                setPosition={(coords) => handleMapClick(coords, setFieldValue)}
                            />
                        </MapContainer>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label htmlFor='dateVisited'>Date Visited</Form.Label>
                        <Field name='dateVisited' type='date' className='form-control' />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label htmlFor='description'>Description</Form.Label>
                        <ErrorMessage name='description'>
                            {(msg) => <p className='text-danger'>{msg}</p>}
                        </ErrorMessage>
                        <Field name='description' as='textarea' placeholder={descriptionPlaceholder} className='form-control' />
                    </Form.Group>

                    <Form.Group className='mt-2'>
                        <Form.Label htmlFor='image' className='me-1'>Image:</Form.Label>
                        <Button
                            variant='outline-secondary'
                            size='sm'
                            className='me-1'
                            onClick={() => fileInputRef.current.click()}
                        >
                            Choose File
                        </Button>
                        <input
                            ref={fileInputRef}
                            type='file'
                            accept='image/*'
                            hidden
                            onChange={async (e) => {
                                const file = e.currentTarget.files[0];
                                if (!file) return;
                                const blob = await processImage16x9(file);
                                setFieldValue('image', blob);
                            }}
                        />
                        {values.image && (
                            <img
                                src={URL.createObjectURL(values.image)}
                                alt='Preview'
                                style={{ width: '50%', objectFit: 'cover', marginTop: 10 }}
                            />
                        )}
                        <ErrorMessage name='image'>
                            {(msg) => <p className='text-danger'>{msg}</p>}
                        </ErrorMessage>
                    </Form.Group>
                    <Button className='mt-3' type='submit' disabled={loading}>
                        {loading ? (
                            <>
                                <Spinner
                                    as='span'
                                    animation='border'
                                    size='sm'
                                    role='status'
                                    aria-hidden='true'
                                    className='me-2'
                                />
                                Uploading...
                            </>
                        ) : submitLabel}
                    </Button>
                </FForm>
            )}
        </Formik>
    );
};

export default AddPlaceForm;