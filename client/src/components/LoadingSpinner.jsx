import Spinner from 'react-bootstrap/Spinner';
import Stack from 'react-bootstrap/Stack'

function LoadingSpinner() {
  return (
    <Stack>
    <Spinner className='mx-auto mt-5' animation="border" role="status" variant="primary">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
    </Stack>
  );
}

export default LoadingSpinner;