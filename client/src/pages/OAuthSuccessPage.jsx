import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginWithOAuthToken } from '../features/user/userSlice';
import { validateLogin } from '../features/user/userSlice';
import Spinner from 'react-bootstrap/Spinner';

const OAuthSuccessPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const run = async () => {
            const params = new URLSearchParams(window.location.search);
            const token = params.get('token');
            if (token) {
                dispatch(loginWithOAuthToken(token));
                await dispatch(validateLogin())
            }
            navigate('/', { replace: true });
        };
        run();
    }, [dispatch, navigate]);

    return (
        <div className='d-flex flex-column align-items-center justify-content-center mt-5'>
            <Spinner animation='border' variant='primary' />
            <div className='mt-3'>Completing Sign in...</div>
        </div>
    )

};

export default OAuthSuccessPage;