import { Link } from 'react-router-dom';
import { useState } from 'react';
import logo from '../../assets/images/logo.png';
import AccountModal from './AccountModal/AccountModal';
import './Navbar.css';

const Navbar = ({ login, setLogin }) => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const handleCloseLoginModal = () => setShowLoginModal(false);
    const handleShowLoginModal = () => setShowLoginModal(true);
    const handleCloseRegisterModal = () => setShowRegisterModal(false);
    const handleShowRegisterModal = () => setShowRegisterModal(true);

    return (
        <div>
            <AccountModal
                type={'login'}
                show={showLoginModal}
                handleClose={handleCloseLoginModal}
                setLoginLabel={setLogin}
            />
            <AccountModal type={'register'} show={showRegisterModal} handleClose={handleCloseRegisterModal} />
            <header className="header">
                <Link to="/">
                    <img src={logo} alt="Deckbay logo" />
                </Link>
                {login.length == 0 && (
                    <div className="header_button_container">
                        <button className="header_button" onClick={handleShowLoginModal}>
                            Sign in
                        </button>
                        <button className="header_button" onClick={handleShowRegisterModal}>
                            Sign up
                        </button>
                    </div>
                )}
                {login.length > 0 && (
                    <div className="header_button_container">
                        <button className="header_button">{login}</button>
                        <button className="header_button">Logout</button>
                    </div>
                )}
                <span className="menu" />
            </header>
        </div>
    );
};

export default Navbar;
