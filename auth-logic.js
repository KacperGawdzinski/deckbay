const fs = require('fs');

class loggingInfo{

    constructor(){ }

    userInsert(login, mail, password){
        console.log( this.userLoginLookup(login) );
        if(!(this.userLoginLookup(login) || this.userMailLookup(mail)))
            fs.appendFileSync('./loginDB.txt', `${login};${mail};${password}\n`);
    }

    userGetPasswordByMail(mail){
        let lines = fs.readFileSync('./loginDB.txt', 'utf-8',  err => { } ).split('\n'),
            pass;
        
        lines.forEach(line => {
            if(line.split(';')[1] === mail) pass = line.split(';')[2];
        });
        return pass;
    }

    userGetPasswordByLogin(login){
        let lines = fs.readFileSync('./loginDB.txt', 'utf-8',  err => { } ).split('\n'),
            pass;
        
        lines.forEach(line => {
            if(line.split(';')[0] === login) pass = line.split(';')[2];
        });
        return pass;
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
}

module.exports = loggingInfo;