class user{
    constructor(login, password, mail){
        this.login = login;
        this.password = password;
        this.mail = mail;
    }
}

users = [];

function createUser(login, password, mail){
    if( users.every( ({ulogin, upassword, umail}) => { return login != ulogin && mail != umail; } ) ){
        users.push( new user(login, password, mail) );
    }
    else{
        throw "User already exists!";
    }
}

function loginUser(login, password){

}