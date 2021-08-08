import { Link } from 'react-router-dom';
import { useState } from 'react';
import logo from '../../assets/images/logo.png';
import AccountModal from './AccountModal/AccountModal';
import './Navbar.css';
import axios from 'axios';

const Navbar = () => {
    const [loginLabel, setLoginLabel] = useState('Sign in');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const handleCloseLoginModal = () => setShowLoginModal(false);
    const handleShowLoginModal = () => setShowLoginModal(true);
    const handleCloseRegisterModal = () => setShowRegisterModal(false);
    const handleShowRegisterModal = () => setShowRegisterModal(true);

    const Logout = () => {
        axios.post('/logout');
        setLoginLabel('Sign in');
    };

    return (
        <div>
            <AccountModal
                type={'login'}
                show={showLoginModal}
                handleClose={handleCloseLoginModal}
                setLoginLabel={setLoginLabel}
            />
            <AccountModal type={'register'} show={showRegisterModal} handleClose={handleCloseRegisterModal} />
            <header className="header">
                <Link to="/">
                    <img src={logo} alt="Deckbay logo" />
                </Link>
                {loginLabel === 'Sign in' && (
                    <div className="header_button_container">
                        <button className="header_button" onClick={handleShowLoginModal}>
                            Sign in
                        </button>
                        <button className="header_button" onClick={handleShowRegisterModal}>
                            Sign up
                        </button>
                    </div>
                )}
                {loginLabel != 'Sign in' && (
                    <div className="header_button_container">
                        <button className="header_button">{loginLabel}</button>
                        <button className="header_button" onClick={Logout}>
                            Logout
                        </button>
                    </div>
                )}
                <span className="menu" />
            </header>
        </div>
    );
};

export default Navbar;
