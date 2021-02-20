import { Modal } from 'react-bootstrap';

const AccountModal = ({ type, show, handleClose }) => {
    return (
        <Modal show={show} onHide={handleClose} centered={true}>
            <Modal.Header closeButton>
                <Modal.Title>Hello!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form autoComplete="off">
                    {type === 'register' && (
                        <div>
                            <label>Email</label>
                            <input type="email" placeholder="Your email..."></input>
                        </div>
                    )}
                    <label>Login</label>
                    <input type="text" placeholder="Your login..." />

                    <label>Password</label>
                    <input type="password" placeholder="Your password..." />

                    <input type="submit" value="Submit" />
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default AccountModal;
