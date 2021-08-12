var express = require('express')
var router = express.Router()

router.get('/', (req, res) => {   //set random nick
    if(!req.signedCookies.login)
        res.cookie("login",  faker.name.findName(), { signed: true });
    res.render('room_list.ejs', { game_type: 'CHESS', user_login : req.login }
)});

router.post('/:id', (req, res) => {  //if two players have the same nick may be problem - remove spaces
    if(req.body.game_type != 'chess') {
        res.status(403);
        res.send("You don't have permission to enter this room!");
        return;
    }
    let fullRoomName = req.body.game_type + "-" + req.params.id
    if(roomPasswd.get(fullRoomName)) {
        let temp = roomPlayers[fullRoomName]
        if(!temp.includes(req.signedCookies.login)) {
            res.status(403);
            res.send("You don't have permission to enter this room!");
            return;
        }
    }
    loginRoom.set(req.signedCookies.login, fullRoomName);
    res.render('game_chess_page', { room_name: req.params.id, game_type: req.body.game_type, user_login: req.signedCookies.login });
});

module.exports = router