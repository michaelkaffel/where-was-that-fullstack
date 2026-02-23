import littleRiver from '../images/IMG_2448.jpeg';
import lakeAngeles from '../images/IMG_1109.jpeg';
import constancePass from '../images/IMG_8998.jpeg';



export const HIKINGTRAILS = [
    {
        id: 0,
        title: 'Little River',
        description: 'Narrow river canyon until you begin to ascend hurricane ridge and then you have alpine views.',
        //googleMaps: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2666.750814726799!2d-123.50399052371729!3d48.057148856757124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x548fb3ce7422ad01%3A0xd7fd95ceb6f6afec!2sLittle%20River%20Trail!5e0!3m2!1sen!2sus!4v1765433551258!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
        image: littleRiver,
        location: 'Port Angeles, WA',
        dateVisited: '12/10/25',
        favorite: false,
        kindOfPlace: 'hike'
    },
    {
        id: 1,
        title: 'Lake Angeles',
        description: 'Relatively short but steep trail up to an alpine lake with camping. Freezes over in the winter.',
        googleMaps: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d36029.798503299615!2d-123.46611767653911!3d48.02016171653884!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x548fb503d81ba531%3A0x66afb8fefe19ce2d!2sLake%20Angeles%20Campground!5e0!3m2!1sen!2sus!4v1765433747192!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
        image: lakeAngeles,
        location: 'Port Angeles, WA',
        dateVisited: '12/10/25',
        favorite: false,
        kindOfPlace: 'hike'
    },
    {
        id: 2,
        title: 'Constance Pass',
        description: 'Accessed as a day trip while backpacking at boulder campsite by Marmot Pass.',
        googleMaps: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10726.97004804908!2d-123.1768584318439!3d47.76704856204529!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x548fd4b7b31c13f5%3A0x2e0c81d92a9b508f!2sConstance%20Pass!5e0!3m2!1sen!2sus!4v1765434021496!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
        image: constancePass,
        location: 'Brinnon, WA',
        dateVisited: '12/10/25',
        favorite: false,
        kindOfPlace: 'hike'
    }
]