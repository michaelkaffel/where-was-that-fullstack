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
                <span>↗</span><span>{children}</span>
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
                            <h2 className='text-white mb-3'>Use the Dashboard for quick access</h2>
                            <p className='text-white'>
                                Once logged in this page becomes your Dashboard where you can quickly find all your saved locations.
                                Use the navbar to access the Account Details page, all your Saved Places grouped by category pages, and the Add Locations page.
                            </p>

                            <div className='d-flex justify-content-end' style={{ fontSize: '0.75rem', color: '#a8dadc' }}>
                                <span className='text-end'>
                                    account settings — update username, email, password, or delete your account ↓
                                </span>
                            </div>
                            <div style={{ ...wf }} className='d-flex align-items-center justify-content-between px-2'>
                                <small className='text-white'>dashboard · add locations · saved locations ▾</small>
                                <small className='text-white'>account settings · log out</small>
                            </div>
                            <Callout>saved locations ▾ opens hiking trails / camping spots / scenic lookouts</Callout>


                            <div style={{ ...wf, height: 100, marginTop: 8 }} className='d-flex align-items-center justify-content-center'>
                                <small className='text-white'>map — all saved locations</small>
                            </div>
                            <Callout>pin color matches category: hikes / campsites / overlooks</Callout>

                            <div className='d-flex gap-2 mt-2'>
                                <div style={{ ...wf, flex: 1, height: 28, borderColor: '#2d6a4f' }} className='d-flex align-items-center justify-content-center'><small className='text-white'>hikes</small></div>
                                <div style={{ ...wf, flex: 1, height: 28, borderColor: '#e76f51' }} className='d-flex align-items-center justify-content-center'><small className='text-white'>campsites</small></div>
                                <div style={{ ...wf, flex: 1, height: 28, borderColor: '#457b9d' }} className='d-flex align-items-center justify-content-center'><small className='text-white'>overlooks</small></div>
                            </div>
                            <Callout>quick links to each category page</Callout>

                            <div style={{ ...wf, height: 30, marginTop: 10 }} className='d-flex align-items-center px-2'>
                                <small className='text-white '>revisit your locations</small>
                            </div>
                            <div className='d-flex gap-2 mt-2'>
                                {[1, 2, 3].map((n) => (
                                    <div key={n} style={{ ...wf, flex: 1, height: 44 }} className='d-flex align-items-center justify-content-center'>
                                        <small className='text-white'>photo</small>
                                    </div>
                                ))}
                            </div>
                            <Callout>3 randomly picked saved locations, for inspiration</Callout>
                        </div>
                    </Carousel.Item>

                    <Carousel.Item>
                        <div className='orientation-slide p-4 text-start mx-auto' style={{ maxWidth: 750 }}>
                            <h2 className='text-white mb-3'>Using the Add Locations form</h2>
                            <p className='text-white'>
                                Use the Add Locations page or the Saved Locations pages to add your hiking trails, camping spots, and scenic overlooks.
                                We recommend uploading a 'landscape orientation' image or your image wil be cropped to fit.
                            </p>
                            <div style={{ ...wf, height: 30 }} className='d-flex align-items-center justify-content-between px-2'>
                                <small className='text-white'>add a hike!</small>
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
                            <Callout>all fields required — location auto-fills from the pin if left blank</Callout>

                            <div style={{ ...wf, height: 22, marginTop: 6 }} className='d-flex align-items-center justify-content-between px-2'>
                                <small className='text-white'>add a campsite!</small><small className='text-white'>▾</small>
                            </div>
                            <div style={{ ...wf, height: 22, marginTop: 4 }} className='d-flex align-items-center justify-content-between px-2'>
                                <small className='text-white'>add an overlook!</small><small className='text-white'>▾</small>
                            </div>
                            <Callout>one accordion per category — only one open at a time</Callout>

                            <div style={{ ...wf, height: 16, marginTop: 10 }} className='d-flex align-items-center px-2'>
                                <small className='text-white'>all your spots at a glance</small>
                            </div>
                            <div style={{ ...wf, height: 44, marginTop: 6 }} className='d-flex align-items-center justify-content-center'>
                                <small className='text-white'>map — every saved location</small>
                            </div>
                        </div>
                    </Carousel.Item>

                    <Carousel.Item>
                        <div className='orientation-slide p-4 text-start mx-auto' style={{ maxWidth: 750 }}>
                            <h2 className='text-white mb-3'>Places grouped by categories</h2>
                            <p className='text-white'>
                                Each category has their own Saved Locations page where you can view all (or just your favorite) places in a map and list view.
                            </p>
                            <small className='text-white d-block mb-2'>dashboard / hiking trails</small>

                            <div style={{ ...wf, height: 22 }} className='d-flex align-items-center justify-content-between px-2'>
                                <small className='text-white'>add hikes</small><small className='text-white'>▾</small>
                            </div>
                            <Callout>same add accordion lives at the top of every category page</Callout>

                            <div style={{ ...wf, height: 90, marginTop: 8 }} className='d-flex align-items-center justify-content-center'>
                                <small className='text-white'>map — pins for this category only</small>
                            </div>

                            <div className='d-flex gap-2 mt-2'>
                                <div style={{ ...wf, flex: 1, height: 22, borderColor: '#2d6a4f' }} className='d-flex align-items-center justify-content-center'><small className='text-white'>all hikes</small></div>
                                <div style={{ ...wf, flex: 1, height: 22 }} className='d-flex align-items-center justify-content-center'><small className='text-white'>favorites</small></div>
                            </div>
                            <Callout>toggle between everything saved and just your favorites</Callout>

                            <div className='d-flex gap-2 mt-2'>
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
                            <Callout>each card: view details, favorite, or delete</Callout>
                        </div>
                    </Carousel.Item>

                    <Carousel.Item>
                        <div className='orientation-slide p-4 text-start mx-auto' style={{ maxWidth: 740 }}>
                            <h2 className='text-white mb-3'>Each place gets its own 'card'</h2>
                            <p className='text-white'>
                                Every saved place has its own unique page that is generated when you save a new location. Use that places page to quickly get directions or use the 'notepad' to keep track of changes at your spot.
                            </p>

                            <small className='text-white d-block mb-2'>dashboard / hiking trails / ruby beach</small>

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
                            <Callout>map pin links straight out to google maps</Callout>

                            <div style={{ ...wf, height: 56, marginTop: 10 }} className='p-2'>
                                <small className='text-white d-block'>notes</small>
                                <small className='text-white d-block' style={{ fontSize: '0.65rem' }}>no notes for this place yet</small>
                                <div className='d-flex justify-content-end mt-1'>
                                    <div style={{ ...wf, width: 60, height: 18 }} className='d-flex align-items-center justify-content-center'>
                                        <small className='text-white' style={{ fontSize: '0.6rem' }}>add note</small>
                                    </div>
                                </div>
                            </div>
                            <Callout>notes stay attached to the place — add, edit, or delete right here</Callout>
                        </div>
                    </Carousel.Item>

                    <Carousel.Item>
                        <div className='orientation-slide p-4 text-start mx-auto' style={{ maxWidth: 750 }}>
                            <h2 className='text-white mb-3'>Why Where Was That?</h2>

                            <p className='text-white' style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                                Where Was That is a passion project — built to make getting outside, and remembering where you've been, a little easier and a lot more fun.
                            </p>
                            <p className='text-white' style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                                It also doubles as a working example of what I build. If you want a custom site of your own, check out Down By The River Development.
                            </p>
                            {/* <div style={{ ...wf, height: 40 }} className='d-flex align-items-center justify-content-center'>
                                <small className='text-white'>Down By The River Development — get in touch</small>
                            </div> */}
                            <a
                                href="https://downbyriverdev.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className='orientation-cta d-flex align-items-center justify-content-center'
                                style={{ ...wf, height: 40, textDecoration: 'none' }}
                            >
                                <small className='text-white'>Get in touch!</small>
                            </a>
                            <p className='text-white mt-3' style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                                Run into a bug, or have an idea for this app? I read every message — reach out any time.
                            </p>
                            {/* <div style={{ ...wf, height: 32 }} className='d-flex align-items-center justify-content-center'>
                                <small className='text-white'>contact@where-was-that.com</small>
                            </div> */}
                            <a
                                href="mailto:contact@where-was-that.com"
                                className='orientation-cta d-flex align-items-center justify-content-center'
                                style={{ ...wf, height: 32, textDecoration: 'none' }}
                            >
                                <small className='text-white'>contact@where-was-that.com</small>
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

