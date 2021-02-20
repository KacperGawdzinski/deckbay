import { Link } from 'react-router-dom';
import { useState } from 'react';
import logo from '../../assets/images/logo.png';
import './Navbar.css';
import { Button, Modal } from 'react-bootstrap';

const Navbar = () => {
    const [toggleLoginModal, setToggleLoginModal] = useState(false);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div>
            <header className="header">
                <Link to="/">
                    <img src={logo} alt="Deckbay logo" />
                </Link>

                <div className="header_button_container">
                    <button className="header_button" onClick={handleShow}>
                        Sign up
                    </button>

                    <button className="header_button">Sign in</button>
                </div>
                <span className="menu" />
            </header>
        </div>
    );
};

export default Navbar;
