import { useDispatch } from "react-redux";
import { deleteNote } from './placesSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { far } from '@fortawesome/free-regular-svg-icons';

library.add(far);

const NoteCard = ({ note, placeId }) => {
    const dispatch = useDispatch();
    const { text, date, id } = note;
    const formattedDate = new Date(date).toLocaleDateString();

    return (
        <>
            <div className='d-flex justify-content-between'>
                <p>{text}</p>
                <FontAwesomeIcon 
                    onClick={() => dispatch(deleteNote({ placeId, noteId: id}))}
                    icon='fa-regular fa-circle-xmark'
                    style={{ cursor: 'pointer'}}
                />
            </div>
            <p style={{ fontSize: '.8rem', marginTop: '-.7rem'}} className='text-end'>
                {formattedDate}
            </p>
            <hr />
        </>
    );
};

export default NoteCard;