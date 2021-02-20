import { Link } from 'react-router-dom'
import { useState } from 'react'
import logo from '../../assets/images/logo.png'
import './Navbar.css'
import './Modal.css'
import {Button, Modal} from 'react-bootstrap'

const Navbar = () => {
  const [toggleLoginModal, setToggleLoginModal] = useState(false)
  const [show, setShow] = useState(false);
//fix container class
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
    return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <header id="head" className="header">
          <Link to="/"> <img src={logo} alt="Deckbay logo"/> </Link>
      
          <div className="header_button_container">
            <button className="header_button" onClick={handleShow}>
                  Sign up
            </button>
      
            <button className="header_button">
                  Sign in
            </button>
          </div>
          <span className="menu" />
      </header>
    </div>
)}

export default Navbar;