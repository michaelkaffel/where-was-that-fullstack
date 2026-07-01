import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const PrivacyModal = ({ show, onHide }) => {
    return (
        <Modal show={show} onHide={onHide} centered scrollable size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>
                    Privacy Policy & Disclosures
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className='text-muted small'>
                    Last updated: June 2026
                </p>

                <h6>What We Collect</h6>
                <p>
                    When you create an account, we collect your username, first and last name,
                    and email address. If you sign up with Google, we receive your name, email,
                    and Google account ID from Google's OAuth service. 
                </p>

                <h6>Places, Notes, & Photos</h6>
                <p>
                    Any places, notes, and photos you add are stored under your account and are
                    only visible to you. Uploaded images are stored in Google Cloud Storage and
                    are removed automatically when you delete the associated place or your account.
                </p>

                <h6>How We Use Your Data</h6>
                <p>
                    Your data is used solely to operate the app — authenticating you, displaying
                    your saved places, and enabling account features like password resets. We do
                    not sell your data or share it with third parties for marketing purposes.
                </p>

                <h6>Authentication</h6>
                <p>
                    We use JSON Web Tokens (JWT) to keep you logged in, stored in your browser's
                    localStorage. If you sign in with Google, authentication is handled by
                    Google's OAuth service under{' '}
                    <a
                        href='https://policies.google.com/privacy'
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        Google's own privacy policy
                    </a>.
                </p>

                <h6>Cookies & Tracking</h6>
                <p>
                    Where Was That does not currently use analytics, tracking cookies, or
                    advertising services.
                </p>

                <h6>Data Deletion</h6>
                <p>
                    You can delete your account at any time from your profile page. This
                    permanently removes your user record, all associated places, and their
                    uploaded images.
                </p>

                <h6>Contact</h6>
                <p className='mb-0'>
                    Questions about this policy? Reach out at{' '}
                    <a href='mailto:contact@where-was-that.com'>contact@where-was-that.com</a>.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='primary' onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PrivacyModal;