const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models/userModel');
const Token = require('../models/tokenModel');
const saltRounds = 10;

router.post('/login', async (req, res) => {
    const user = await User.findOne({
        login: req.body.login,
    });
    if (!user) {
        res.status(401).json({ error: 'User not found' });
        return;
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        res.status(401).json({ error: 'Invalid password' });
        return;
    }

    const userObject = {
        login: req.body.login,
    };
    const accessToken = jwt.sign(userObject, process.env.JWT_ACCESS_TOKEN, { expiresIn: '15s' });
    const refreshToken = jwt.sign(userObject, process.env.JWT_REFRESH_TOKEN);

    await Token.create({
        value: refreshToken,
    });

    res.cookie('jwtAccess', accessToken, {
        //httpOnly: true,
    });
    res.cookie('jwtRefresh', refreshToken, {
        //path: '/refresh',
    });
    res.status(200).json({ login: req.body.login });
});

router.post('/register', async (req, res) => {
    const hashed = await bcrypt.hash(req.body.password, saltRounds);
    try {
        await User.create({
            email: req.body.email,
            login: req.body.login,
            password: hashed,
        });
    } catch (err) {
        if (err.code === 11000) {
            res.send(401).json({ error: 'User already exists' });
            return;
        }
    }
    res.sendStatus(200);
});

router.post('/logout', (req, res) => {
    try {
        Token.findOneAndRemove({
            value: req.cookies['jwtRefresh'],
        });
        res.cookie('jwtAccess', 0, {
            maxAge: -1,
        });
        res.cookie('jwtRefresh', 0, {
            maxAge: -1,
        });
        res.sendStatus(200);
    } catch (err) {
        res.send(500);
    }
});

module.exports = router;
