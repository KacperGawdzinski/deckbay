const lmodal = document.getElementById("login_modal");
const rmodal = document.getElementById("register_modal");

const lbtn = document.getElementById("login_button");
const rbtn = document.getElementById("register_button");

const rexit = document.getElementsByClassName("close")[0];
const lexit = document.getElementsByClassName("close")[1];

const rsubmit = document.getElementById('register_send');
const lsubmit = document.getElementById('login_send');

lbtn.addEventListener('click', () => { 
    if( lbtn.innerHTML.trim() === 'Sign in' ){
        lmodal.style.display = "block"; 
    }
    else{
        document.getElementById('logout_reqUrl').value = window.location.href;
        document.getElementById('logout').submit();
    }
});

rbtn.addEventListener('click', () => { 
    if( rbtn.innerHTML.trim() === 'Sign up' ){
        rmodal.style.display = "block"; 
    }
    else{
        document.getElementById('logout_reqUrl').value = window.location.href;
        document.getElementById('logout').submit();
    }
});

lexit.addEventListener('click', () => { 
    lmodal.style.display = "none"; 
}); 

rexit.addEventListener('click', () => { 
    rmodal.style.display = "none"; 
});

rsubmit.addEventListener('click', () => {
    document.getElementById('register_reqUrl').value = window.location.href;
    document.getElementById('register_form').submit();
});

lsubmit.addEventListener('click', () => {
    document.getElementById('login_reqUrl').value = window.location.href;
    document.getElementById('login_form').submit();
});

window.addEventListener('click', function(event) {
    if (event.target == lmodal)
        lmodal.style.display = "none";
    else if(event.target == rmodal)
        rmodal.style.display = "none";
});