const Modal = ({ show }) => {
    //return value to parent component - handleClose
    return (
        <Modal show={show} onHide={handleClose} centered={true}>
            <Modal.Header closeButton>
                <Modal.Title>Hello!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form action="/login" name="login_form" method="POST" autocomplete="off">
                    <label>Login</label>
                    <input type="text" name="login" placeholder="Your login..." />

                    <label>Password</label>
                    <input type="password" name="passwd" placeholder="Your password..." />

                    <input type="submit" value="Submit" />
                </form>
            </Modal.Body>
        </Modal>
    );
};
