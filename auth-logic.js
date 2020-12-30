const fs = require('fs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

class loggingInfo{

    transporter = nodemailer.createTransport({       //HIDE
        service : 'gmail',
        auth : {
            user : 'deckbay.notifications@gmail.com',
            pass : 'szajnertochuj1'
        }
    })

    constructor(){ }

    userInsert(login, mail, password){
        if(!this.userLookup(login, mail))
            fs.appendFileSync('./DB/loginDB.txt', `${login};${mail};${password}\n`);
    }

    userGetPasswordByMail(mail){
        let lines = fs.readFileSync('./DB/loginDB.txt', 'utf-8',  err => { } ).split('\n'),
            pass;
        
        lines.forEach(line => {
            if(line.split(';')[1] === mail) pass = line.split(';')[2];
        });
        return pass;
    }

    userGetPasswordByLogin(login){
        let lines = fs.readFileSync('./DB/loginDB.txt', 'utf-8',  err => { } ).split('\n'),
            pass;
        
        lines.forEach(line => {
            if(line.split(';')[0] === login) pass = line.split(';')[2];
        });
        return pass;
    }

    userLookup(login, mail){ //checks whether given login or mail is already taken
        return this.userLoginLookup(login) || this.userMailLookup(mail);
    }

    userLoginLookup(login){
        return this.userGetPasswordByLogin(login) !== undefined;
    }

    userMailLookup(mail){
        return this.userGetPasswordByMail(mail) !== undefined;
    }

    userValidateByLogin(login, password){
        return this.userGetPasswordByLogin(login) === password;
    }

    userValidateByMail(mail){
        return this.userGetPasswordByMail(mail) === password;
    }

    insertMailToVerify(login, mail, password){ //it sends an email too!
        let ID = crypto.randomBytes(30).toString('hex');
        if( !this.mailDBlookup(login, mail) ){
            fs.appendFileSync('./DB/mailsDB.txt', `${login};${mail};${ID};${password}\n`);

            var mailOptions = {
                from: 'deckbay.notifications@gmail.com',
                to: `${mail}`,
                subject: `Verification link for account ${login}!`,
                html: `<a href="http://localhost:3000/verify/${ID}">Clik for verification!</a>`
              };

            this.transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
        } else {
            return false;
        }
    }

    checkID(ID){
        let lines = fs.readFileSync('./DB/mailsDB.txt', 'utf-8',  err => { } ).split('\n'),
            newFile = fs.writeFileSync('./DB/mailsDB.txt', '', (err, data) => { }),
            found = false;

        for(let i = 0; i < lines.length; i++){
            let pom = lines[i].split(';');
            if(pom[2] === ID){
                this.userInsert(pom[0], pom[1], pom[3]);
                found = pom[0];
            } else {
                fs.appendFileSync('./DB/mailsDB.txt', pom.join(';'));
            }
        }

        return found;
    }

    mailDBlookup(login, mail){
        let lines = fs.readFileSync('./DB/mailsDB.txt', 'utf-8',  err => { } ).split('\n'),
            pass = false;

        lines.forEach(line => {
            if(line.split(';')[0] === login || line.split(';')[1] === mail) pass = true;
        });

        return pass;
    }
}

function authorize(req, res, next){
    if ( req.signedCookies.login ){
        req.login = req.signedCookies.login;
    } else {
        req.login = '';
    }
    next();
}

module.exports = { loggingInfo, authorize };