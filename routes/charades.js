const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

// define the home page route
router.post('/validate-room', async function (req, res) {
    let ar = req.app.locals.availableRooms(req.body.game);
    let fullRoomName = (req.body.game + '-' + req.body.room).toLowerCase();
    for (let i = 0; i < ar.length; i++) {
        if (ar[i][fullRoomName] === fullRoomName) {
            res.json({ err: 'Room already exists!' });
            return;
        }
    }

    if (req.body.room.length > 15) {
        res.json({ err: 'Room name is too long!' });
        return;
    }

    if (req.body.room === '') {
        res.json({ err: 'Insert room name!' });
        return;
    }

    if (req.body.password) {
        const hashed = await bcrypt.hash(req.body.password, saltRounds);
        req.app.locals.roomPasswd.set(fullRoomName, hashed);
        req.app.locals.roomPlayers[fullRoomName] = [req.signedCookies.login];
    }

    req.app.locals.roomOptions.set(fullRoomName, {
        category: req.body.category,
    });

    res.sendStatus(200);
});

router.post('/:id', (req, res) => {
    //if two players have the same nick may be problem - remove spaces
    res.send('Birds home page');
});

module.exports = router;
