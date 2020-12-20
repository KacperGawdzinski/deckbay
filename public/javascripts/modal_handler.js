const lmodal = document.getElementById("login_modal");
const rmodal = document.getElementById("register_modal");

const lbtn = document.getElementById("login_button");
const rbtn = document.getElementById("register_button");

const rexit = document.getElementsByClassName("close")[0];
const lexit = document.getElementsByClassName("close")[1];

const rsubmit = document.getElementById('register_send');
const lsubmit = document.getElementById('login_send');

lbtn.addEventListener('click', () => { 
    lmodal.style.display = "block"; 
});

rbtn.addEventListener('click', () => { 
    rmodal.style.display = "block"; 
});

lexit.addEventListener('click', () => { 
    lmodal.style.display = "none"; 
}); 

rexit.addEventListener('click', () => { 
    rmodal.style.display = "none"; 
}); 

window.addEventListener('click', function(event) {
    if (event.target == lmodal)
        lmodal.style.display = "none";
    else if(event.target == rmodal)
        rmodal.style.display = "none";
});

rsubmit.addEventListener('click', () => {

});

lsubmit.addEventListener('click', () => {

});