import { useState } from 'react'
import { useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Formik, Field, Form as FForm, ErrorMessage } from 'formik';
import { validateForm } from '../../utils/validateForm';
import { processImage16x9 } from '../../utils/processImage16x9';
import { postPlace } from './placesSlice';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
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
    return position ? <Marker position={position}/> : null;
}

const AddPlaceForm = ({ kindOfPlace, titlePlaceholder, descriptionPlaceholder, submitLabel }) => {
    const dispatch = useDispatch();
    const [showMap, setShowMap] = useState(false);
    const [mapPosition, setMapPosition] = useState(null);
    const [geoError, setGeoError] = useState(null);

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
        setShowMap(false);
    };

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

    const handleMapClick = (coords, setFieldValue) => {
        setMapPosition(coords);
        setFieldValue('location.lat', coords[0]);
        setFieldValue('location.lng', coords[1]);
    }

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
            {({ setFieldValue, values }) => (
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
                        <Button
                            variant='outline-secondary'
                            size='sm'
                            type='button'
                            onClick={() => setShowMap(!showMap)}
                        >
                            {showMap ? 'Hide Map' : 'Add Location Pin'}
                        </Button>

                        {showMap && (
                            <div className='my-2'>
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
                                <MapContainer
                                    center={mapPosition || [47.5, -120.5]}
                                    zoom={mapPosition ? 12 : 6}
                                    style={{height: '300px', width: '100%', borderRadius: '8px'}}
                                >
                                    <TileLayer 
                                        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                                        attribution='© OpenStreetMap contributors'
                                    />
                                    <LocationPicker 
                                        position={mapPosition}
                                        setPosition={(coords) => handleMapClick(coords, setFieldValue)}
                                    />

                                </MapContainer>
                            </div>
                        )}
                    </Form.Group>

                    <Form.Group>
                        <Form.Label htmlFor='dateVisited'>Date Visited</Form.Label>
                        <Field name='dateVisited' type='date' className='form-control' />
                    </Form.Group>

                    <Form.Group>
                        <ErrorMessage name='description'>
                            {(msg) => <p className='text-danger'>{msg}</p>}
                        </ErrorMessage>
                        <Form.Label htmlFor='description'>Description</Form.Label>
                        <Field name='description' as='textarea' placeholder={descriptionPlaceholder} className='form-control' />
                    </Form.Group>

                    <Form.Group className='mt-2'>
                        <Form.Label htmlFor='image'>Image</Form.Label>
                        <input 
                            type='file'
                            accept='image/*'
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
                    <Button className='mt-3' type='submit'>{submitLabel}</Button>
                </FForm>
            )}
        </Formik>
    );
};

export default AddPlaceForm;