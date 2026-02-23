import { useDispatch } from "react-redux";
import { deleteOverlookComment } from "./overlooksCommentsSlice";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


library.add(fas, far)

const OverlookComment = ({ comment }) => {

    const dispatch = useDispatch();
    
    const { text: commentText, date, id } = comment;

    const formattedDate = new Date(date).toLocaleDateString();
    
        return (
            <>
                
                <div className="d-flex justify-content-between">
                    <p>{commentText}</p>
                    <FontAwesomeIcon
                        onClick={() => dispatch(deleteOverlookComment(id))}
                        icon='fa-regular fa-circle-xmark'
                    />
                    
                </div>
                <p style={{ fontSize: '.8rem', marginTop: '-.7rem' }} className='text-end'>{formattedDate}</p>
    
                <hr />
    
            </>
        )
};

export default OverlookComment;