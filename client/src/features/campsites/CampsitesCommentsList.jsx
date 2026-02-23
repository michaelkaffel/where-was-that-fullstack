import { useSelector } from 'react-redux';
import Col from 'react-bootstrap/Col';
import { selectCampsitesCommentsbyCampsiteId } from './campsitesCommentsSlice';
import CampsiteComment from './CampsiteComment';
import CampsiteCommentForm from './CampsiteCommentForm';


const CampsitesCommentsList = ({ campsiteId }) => {
    const comments = useSelector(
        selectCampsitesCommentsbyCampsiteId(campsiteId)
    );

    if (comments && comments.length > 0) {
        return (
            <Col>
                <h4 className='mb-3 text-center text-decoration-underline'>Comments</h4>
                {comments.map((comment) => {
                    return <CampsiteComment
                        key={comment.id}
                        comment={comment}
                    />
                })}
                <CampsiteCommentForm campsiteId={campsiteId} />
            </Col>
        )
    };

    return (
        <Col className='m-1'>
            <h4 className='mb-3 text-center text-decoration-underline'>Comments</h4>
            <p>There are no comments for this campsite yet.</p>
            <CampsiteCommentForm campsiteId={campsiteId} />
        </Col>
    );

};

export default CampsitesCommentsList;