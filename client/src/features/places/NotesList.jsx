import { useSelector } from 'react-redux';
import Col from 'react-bootstrap/Col';
import { selectNotesByPlaceId } from './placesSlice';
import NoteCard from './NoteCard';
import NoteForm from './NoteForm';

const NotesList = ({ placeId }) => {
    const notes = useSelector(selectNotesByPlaceId(placeId));

    return (
        <Col>
            <h4 className='mb-3 text-center text-decoration-underline'>
                Notes
            </h4>
            {notes && notes.length > 0 ? (
                notes.map((note) => (
                    <NoteCard 
                        key={note.id}
                        note={note}
                        placeId={placeId}
                    />
                ))
            ) : (
                <p>No notes for this place yet</p>
            )}
            <NoteForm placeId={placeId}/>
        </Col>
    );
};

export default NotesList;