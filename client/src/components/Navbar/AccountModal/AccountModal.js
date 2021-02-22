import { Modal } from 'react-bootstrap';
import { useState } from 'react';
import axios from 'axios';

const AccountModal = ({ type, show, handleClose, setLoginLabel }) => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const Submit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post(type, {
                login: login,
                password,
                password,
                ...(type === 'register' && { email: email }),
            });
            setLoginLabel(res.data.login);
            //localStorage.setItem('login', res.data.login);
        } catch (err) {
            console.log(err.response);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered={true}>
            <Modal.Header closeButton>
                <Modal.Title>Hello!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form autoComplete="off" onSubmit={Submit}>
                    {type === 'register' && (
                        <div>
                            <label>Email</label>
                            <input type="email" placeholder="Your email..." onChange={e => setEmail(e.target.value)} />
                        </div>
                    )}
                    <label>Login</label>
                    <input type="text" placeholder="Your login..." onChange={e => setLogin(e.target.value)} />

                    <label>Password</label>
                    <input type="password" placeholder="Your password..." onChange={e => setPassword(e.target.value)} />

                    <input type="submit" value="Submit" />
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default AccountModal;
