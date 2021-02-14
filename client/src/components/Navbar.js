import { Link } from 'react-router-dom'
import './Navbar.css'
import logo from '../assets/images/logo.png'

//przerobic!
const Navbar = () => {
    return (
    <header id="head" className="header">
        <Link to="/"> <img src={logo} alt="Deckbay logo"/> </Link>
    
        <div className="header_button_container">
          <button className="header_button" id="register_button">
                Sign up
          </button>
    
          <button className="header_button" id="login_button">
                Sign in
          </button>
        </div>
        <span className="menu" />
    </header>
)}

export default Navbar;