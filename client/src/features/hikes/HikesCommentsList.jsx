import { useSelector } from "react-redux";
import Col from 'react-bootstrap/Col';
import { selectHikesCommentsByHikesId } from "./hikesCommentsSlice";
import HikeComment from "./HikeComment";
import HikeCommentForm from "./HikeCommentForm";


const HikesCommentsList = ({ hikeId }) => {
    const comments = useSelector(selectHikesCommentsByHikesId(hikeId))

    if (comments && comments.length > 0) {
        return (
            <Col>
                <h4 className='mb-3 text-center text-decoration-underline'>Comments</h4>
                {comments.map((comment) => {
                    return <HikeComment 
                                key={comment.id} 
                                comment={comment}
                            />
                })}
                <HikeCommentForm hikeId={hikeId} />
            </Col>
        )
    };

    return (
        <Col className='m-1'>
            <h4 className='mb-3 text-center text-decoration-underline'>Comments</h4>
            <p>There are no comments for this hike yet.</p>
            <HikeCommentForm hikeId={hikeId} />
        </Col>
    );
};

export default HikesCommentsList;