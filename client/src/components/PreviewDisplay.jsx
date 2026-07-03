import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Carousel from 'react-bootstrap/Carousel'
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectRandomPlaceByType } from '../features/places/placesSlice';
import { selectIsAuthenticated } from '../features/user/userSlice';
import { Link } from 'react-router-dom';
import PreviewCard from './PreviewCard';

const PreviewDisplay = ({ onShowLogin, onShowSignup }) => {

    const isAuthenticated = useSelector(selectIsAuthenticated);
    const campsite = useSelector(selectRandomPlaceByType('campsite'));
    const hike = useSelector(selectRandomPlaceByType('hike'));
    const overlook = useSelector(selectRandomPlaceByType('overlook'));
    const [activeSlide, setActiveSlide] = useState(0);
    const slideCount = 5;

    const detailPaths = {
        hike: '/hiking-trails',
        campsite: '/camping-spots',
        overlook: '/scenic-overlooks'
    }

    if (!isAuthenticated) {
        const wf = {
            background: 'rgba(255,255,255,0.08)',
            border: '1px dashed rgba(255,255,255,0.4)',
            borderRadius: '6px'
        };

        const Callout = ({ children }) => (
            <div className='d-flex align-items-center gap-1 mt-1' style={{ fontSize: '0.75rem', color: '#a8dadc' }}>
                <span></span><span>{children}</span>
            </div>
        );

        return (
            <Container className='text-center'>

                <button
                    type='button'
                    className='orientation-nav-btn orientation-nav-prev'
                    onClick={() => setActiveSlide((activeSlide - 1 + slideCount) % slideCount)}
                    aria-label='Previous slide'
                >
                    ‹
                </button>

                <Carousel
                    activeIndex={activeSlide}
                    onSelect={(idx) => setActiveSlide(idx)}
                    indicators
                    controls={false}
                    interval={null}
                    className='orientation-carousel'
                >

                    <Carousel.Item>
                        <div className='orientation-slide p-4 text-start mx-auto' style={{ maxWidth: 750 }}>
                            <h2 className='text-white mb-3'>Find your saved places quickly</h2>
                            <p className='text-white'>
                                Once logged in this page becomes your Dashboard where you can quickly find all your saved locations.
                                Use the navbar to access the Dashboard, Account Setting, Saved Locations, and the Add Locations form.
                            </p>

                            <div className='d-flex justify-content-end' style={{ fontSize: '0.75rem', color: '#a8dadc' }}>
                                <span className='text-end'>
                                    Navbar on every page ↓
                                </span>
                            </div>
                            <div style={{ ...wf }} className='d-flex align-items-center justify-content-between px-2'>
                                <small className='text-white'>dashboard · add locations · saved locations ▾</small>
                                <small className='text-white'>account settings · log out</small>
                            </div>
                            <Callout>↓ All your spots at a glance</Callout>


                            <div style={{ ...wf, height: 100, marginTop: 8 }} className='d-flex align-items-center justify-content-center'>
                                <small className='text-white'>map — all saved locations</small>
                            </div>


                            <div className='d-flex gap-2 mt-2'>
                                <div style={{ ...wf, flex: 1, height: 28, borderColor: '#2d6a4f' }} className='d-flex align-items-center justify-content-center'><small className='text-white'>hikes</small></div>
                                <div style={{ ...wf, flex: 1, height: 28, borderColor: '#e76f51' }} className='d-flex align-items-center justify-content-center'><small className='text-white'>campsites</small></div>
                                <div style={{ ...wf, flex: 1, height: 28, borderColor: '#457b9d' }} className='d-flex align-items-center justify-content-center'><small className='text-white'>overlooks</small></div>
                            </div>
                            <Callout>↗ Quick links to each category page</Callout>

                            <div style={{ ...wf, height: 30, marginTop: 10 }} className='d-flex align-items-center px-2'>
                                <small className='text-white '>revisit your locations</small>
                            </div>
                        </div>
                    </Carousel.Item>

                    <Carousel.Item>
                        <div className='orientation-slide p-4 text-start mx-auto' style={{ maxWidth: 750 }}>
                            <h2 className='text-white mb-3'>Save your locations</h2>
                            <p className='text-white'>
                                Use the Add Locations page to add your hiking trails, camping spots, and scenic overlooks.
                                We recommend uploading a 'landscape orientation' image or your image wil be cropped to fit.
                            </p>
                            <div style={{ ...wf, height: 30 }} className='d-flex align-items-center justify-content-between px-2'>
                                <small className='text-white'>Add a hike!</small>
                                <small className='text-white'>▲</small>
                            </div>
                            <div style={{ ...wf, padding: 8, marginTop: 2 }} className='d-flex flex-column gap-2'>
                                <div style={{ ...wf, height: 24 }} className='d-flex align-items-center px-2'><small className='text-white'>title</small></div>
                                <div style={{ ...wf, height: 24 }} className='d-flex align-items-center px-2'><small className='text-white'>location (auto-fills from pin, or type your own)</small></div>
                                <div className='d-flex gap-2'>
                                    <div style={{ ...wf, flex: 1, height: 22 }} className='d-flex align-items-center px-2'><small className='text-white'>search for a place</small></div>
                                    <div style={{ ...wf, width: 70, height: 22 }} className='d-flex align-items-center justify-content-center'><small className='text-white'>locate me</small></div>
                                </div>
                                <div style={{ ...wf, height: 60 }} className='d-flex align-items-center justify-content-center'><small className='text-white'>map — or click to drop a pin manually</small></div>
                                <div style={{ ...wf, height: 24 }} className='d-flex align-items-center px-2'><small className='text-white'>date visited</small></div>
                                <div style={{ ...wf, height: 32 }} className='d-flex align-items-center px-2'><small className='text-white'>description</small></div>
                                <div style={{ ...wf, height: 24 }} className='d-flex align-items-center px-2'><small className='text-white'>choose file — image</small></div>
                                <div style={{ ...wf, height: 24 }} className='d-flex align-items-center justify-content-center'><small className='text-white'>add hike!</small></div>
                            </div>
                            <Callout>↓ Add campsites and overlooks with their own form</Callout>

                            <div style={{ ...wf, height: 22, marginTop: 6 }} className='d-flex align-items-center justify-content-between px-2'>
                                <small className='text-white'>Add a campsite!</small><small className='text-white'>▾</small>
                            </div>
                            <div style={{ ...wf, height: 22, marginTop: 4 }} className='d-flex align-items-center justify-content-between px-2'>
                                <small className='text-white'>Add an overlook!</small><small className='text-white'>▾</small>
                            </div>
                        </div>
                    </Carousel.Item>

                    <Carousel.Item>
                        <div className='orientation-slide p-4 text-start mx-auto' style={{ maxWidth: 750 }}>
                            <h2 className='text-white mb-3'>Find your place by category</h2>
                            <p className='text-white'>
                                Each category has their own Saved Locations page where you can view all (or just your favorite) places in a map and list view.
                            </p>


                            <div style={{ ...wf, height: 22 }} className='d-flex align-items-center justify-content-between px-2'>
                                <small className='text-white'>add hikes</small><small className='text-white'>▾</small>
                            </div>
                            <Callout>↗ Add places on category pages too!</Callout>

                            <div style={{ ...wf, height: 90, marginTop: 8 }} className='d-flex align-items-center justify-content-center'>
                                <small className='text-white'>map — pins for this category only</small>
                            </div>

                            <div className='d-flex gap-2 mt-2'>
                                <div style={{ ...wf, flex: 1, height: 22, borderColor: '#2d6a4f' }} className='d-flex align-items-center justify-content-center'><small className='text-white'>all hikes</small></div>
                                <div style={{ ...wf, flex: 1, height: 22 }} className='d-flex align-items-center justify-content-center'><small className='text-white'>favorites</small></div>
                            </div>
                            {/* <Callout className='text-end'>toggle between everything saved and just your favorites</Callout> */}
                            <div className='d-flex justify-content-end mt-1' style={{ fontSize: '0.75rem', color: '#a8dadc' }}>
                                <span className='text-end'>
                                    Toggle between everything saved and just your favorites ↑
                                </span>
                            </div>

                            <div className='d-flex gap-2 mt-1'>
                                {[1, 2].map((n) => (
                                    <div key={n} style={{ ...wf, flex: 1, height: 60 }} className='d-flex flex-column justify-content-between p-1'>
                                        <small className='text-white text-center'>photo</small>
                                        <div className='d-flex justify-content-between'>
                                            <small className='text-white' style={{ fontSize: '0.65rem' }}>view details</small>
                                            <small className='text-white' style={{ fontSize: '0.65rem' }}>♥ · delete</small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Callout>↗ Each card: view details, favorite, or delete</Callout>
                        </div>
                    </Carousel.Item>

                    <Carousel.Item>
                        <div className='orientation-slide p-4 text-start mx-auto' style={{ maxWidth: 740 }}>
                            <h2 className='text-white mb-3'>Each place gets its own page</h2>
                            <p className='text-white'>
                                Generated when you save a new location to help you quickly get directions, remember details, view a picture, and 'notepad' to keep track of changes at your spot.
                            </p>

                            <div style={{ ...wf, height: 80 }} className='d-flex align-items-center justify-content-center'>
                                <small className='text-white'>photo</small>
                            </div>
                            <div style={{ ...wf, height: 20, marginTop: 6 }} className='d-flex align-items-center px-2'>
                                <small className='text-white'>description</small>
                            </div>
                            <div style={{ ...wf, height: 20, marginTop: 6 }} className='d-flex align-items-center justify-content-between px-2'>
                                <small className='text-white'>location</small>
                                <small className='text-white'>first visit: date</small>
                            </div>
                            <div style={{ ...wf, height: 70, marginTop: 6 }} className='d-flex align-items-center justify-content-center'>
                                <small className='text-white'>map pin</small>
                            </div>
                            <div style={{ ...wf, height: 20, marginTop: 6 }} className='d-flex align-items-center justify-content-center'>
                                <small className='text-white'>open in google maps</small>
                            </div>
                            <Callout>↗ Map pin links straight out to google maps</Callout>

                            <div style={{ ...wf, height: 56, marginTop: 5 }} className='p-2'>
                                <small className='text-white d-block'>notes</small>
                            </div>

                            <div className='d-flex justify-content-end mt-1' style={{ fontSize: '0.75rem', color: '#a8dadc' }}>
                                <span className='text-end'>
                                    notes stay attached to the place — add, edit, or delete right here ↑
                                </span>
                            </div>
                        </div>
                    </Carousel.Item>

                    <Carousel.Item>
                        <div className='orientation-slide p-4 text-start mx-auto' style={{ maxWidth: 750 }}>
                            <h2 className='text-white mb-3'>Why 'Where Was That'</h2>

                            <p className='text-white' style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                                Where Was That is a passion project — built to make getting outside, and remembering where you've been, a little easier and a lot more fun. If you've every had to ask yourself 'where was that?' then you will probably appreciate Where Was That.
                            </p>
                            <p className='text-white' style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                                If you want a custom site of your own, whether a single page or a complex application, I would love to chat. Schedule a conversation with me through my company Down By The River Development.
                            </p>
                            {/* <div style={{ ...wf, height: 40 }} className='d-flex align-items-center justify-content-center'>
                                <small className='text-white'>Down By The River Development — get in touch</small>
                            </div> */}
                            <a
                                href="https://downbyriverdev.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className='orientation-cta d-flex align-items-center justify-content-center border rounded p-2'
                                style={{ textDecoration: 'none' }}
                            >
                                <small className='text-white'>Book a call</small>
                            </a>
                            <p className='text-white mt-3' style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                                Run into a bug, or have an idea for this app? I read every message — reach out any time.
                            </p>
                            {/* <div style={{ ...wf, height: 32 }} className='d-flex align-items-center justify-content-center'>
                                <small className='text-white'>contact@where-was-that.com</small>
                            </div> */}
                            <a
                                href="mailto:contact@where-was-that.com"
                                className='orientation-cta d-flex align-items-center justify-content-center border rounded p-2'
                                style={{ textDecoration: 'none' }}
                            >
                                <small className='text-white'>Drop me a quick message</small>
                            </a>
                        </div>
                    </Carousel.Item>

                </Carousel>

                <button
                    type='button'
                    className='orientation-nav-btn orientation-nav-next'
                    onClick={() => setActiveSlide((activeSlide + 1) % slideCount)}
                    aria-label='Next slide'
                >
                    ›
                </button>
            </Container>
        );
    }

    return (


        <Container>
            <Row className='justify-content-center'>
                <Col>
                    <h2 className='text-center font-setting-second'>Revisit Your Locations</h2>
                </Col>
            </Row>

            <Row className='justify-content-center'>
                <Col md={10} lg={4}>
                    {hike ? (
                        <Link to={`${detailPaths.hike}/${hike.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <PreviewCard item={hike} />
                        </Link>

                    ) : (
                        <h4 className='text-center mt-3 text-white'>Add some hikes!</h4>
                    )}

                </Col>

                <Col md={10} lg={4}>

                    {campsite ? (
                        <Link to={`${detailPaths.campsite}/${campsite.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <PreviewCard item={campsite} />
                        </Link>
                    ) : (
                        <h4 className='text-center mt-3 text-white'>Add some campsites!</h4>
                    )}
                </Col>

                <Col md={10} lg={4}>

                    {overlook ? (
                        <Link to={`${detailPaths.overlook}/${overlook.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <PreviewCard item={overlook} />
                        </Link>
                    ) : (
                        <h4 className='text-center mt-3 text-white'>Add some overlooks!</h4>
                    )}
                </Col>

            </Row>
        </Container>



    );
};

export default PreviewDisplay;

