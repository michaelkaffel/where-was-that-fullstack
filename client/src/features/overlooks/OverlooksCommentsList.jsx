import { useSelector } from "react-redux";
import Col from 'react-bootstrap/Col';
import { selectOverlooksCommentsByOverlookId } from "./overlooksCommentsSlice";
import OverlookComment from "./OverlookComment";
import OverlookCommentForm from "./OverlookCommentForm";

const OverlooksCommentsList = ({ overlookId }) => {
    const comments = useSelector(
        selectOverlooksCommentsByOverlookId(overlookId)
    );

    if (comments && comments.length > 0) {
        return (
            <Col>
                <h4 className='mb-3 text-center text-decoration-underline'>Comments</h4>
                {comments.map((comment) => {
                    return <OverlookComment
                        key={comment.id}
                        comment={comment}
                    />
                })}
                <OverlookCommentForm overlookId={overlookId} />
            </Col>
        )
    };

    return (
        <Col className='m-1'>
            <h4 className='mb-3 text-center text-decoration-underline'>Comments</h4>
            <p>There are no comments for this campsite yet.</p>
            <OverlookCommentForm overlookId={overlookId} />
        </Col>
    );
};

export default OverlooksCommentsList;