import saltCreek from '../images/IMG_0117.jpeg';
import ozetteTriangle from '../images/IMG_6156.jpeg';
import marmotPass from '../images/IMG_2241.jpeg';

export const CAMPSITES = [
    {
        id: 0,
        title: 'Salt Creen Recreation Area',
        description: 'A slightly expensive campground on the north coast of the Olympic Peninsula.',
        googleMaps: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2661.3341069457947!2d-123.7013211237116!3d48.16164164948565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x548fab5063f88d03%3A0xe7ad3767c6c7d281!2sSalt%20Creek%20Recreation%20Area!5e0!3m2!1sen!2sus!4v1765432413985!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
        image: saltCreek,
        location: 'Port Angeles, WA',
        dateVisited: '12/10/25',
        favorite: false,
        kindOfPlace: 'campsite'
    },
    {
        id: 1,
        title: 'Ozette Triangle',
        description: 'Boardwalk backpacking to campsites directly on the beach and surrounding forests.',
        googleMaps: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14185.583542338896!2d-124.71495449530273!3d48.1385416044713!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x548e9a728df91fad%3A0xddf1a9da229e561d!2sOzette%20Triangle%20Coastal%20Trailhead!5e0!3m2!1sen!2sus!4v1765432865671!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
        image: ozetteTriangle,
        location: 'Ozette, WA',
        dateVisited: '12/10/25',
        favorite: false,
        kindOfPlace: 'campsite'
    },
    {
        id: 2,
        title: 'Marmot Pass',
        description: 'Amazing views and camping at the top of Marmot Pass with sites spread out along the ridge.',
        googleMaps: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2678.6066985999564!2d-123.04373652372944!3d47.827838772674006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x548fd6d334efb56d%3A0xf56c58a7b2276381!2sMarmot%20Pass%20Trailhead!5e0!3m2!1sen!2sus!4v1765433215851!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
        image: marmotPass,
        location: 'Brinnon, WA',
        dateVisited: '12/10/25',
        favorite: false,
        kindOfPlace: 'campsite'
    },
]