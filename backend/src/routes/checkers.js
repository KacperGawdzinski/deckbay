var express = require('express')
var router = express.Router()

//add authorize
router.get('/:id', (req, res) => {  //if two players have the same nick may be problem - remove spaces
    res.send('Birds home page')
});

router.get('/', (req, res) => {
    if(!req.signedCookies.login)
        res.cookie("login",  faker.name.findName(), { signed: true });
    res.render('room_list.ejs', { game_type: 'CHECKERS', user_login : req.login }
)});

router.post('/:id', (req, res) => {
    if(req.body.game_type != 'checkers') {
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
    if (roomBoard.hasOwnProperty(fullRoomName)) {
        
    }else{
        var check = new Checkers(1);
        roomBoard[fullRoomName] = check.boarad;
        roomTurn.set(fullRoomName,1);
    }
    res.render('checkers.ejs', { room_name: req.params.id, game_type: req.body.game_type, user_login : req.login });
});

module.exports = router