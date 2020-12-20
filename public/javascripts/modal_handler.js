var lmodal = document.getElementById("login_modal");
var rmodal = document.getElementById("register_modal");

var lbtn = document.getElementById("login_button");
var rbtn = document.getElementById("register_button");

var rexit = document.getElementsByClassName("close")[0];
var lexit = document.getElementsByClassName("close")[1];


lbtn.onclick = function() {
    lmodal.style.display = "block";
}

rbtn.onclick = function() {
    rmodal.style.display = "block";
}

lexit.onclick = function() {
    lmodal.style.display = "none";
}

rexit.onclick = function() {
    rmodal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == lmodal)
        lmodal.style.display = "none";
    else if(event.target == rmodal)
        rmodal.style.display = "none";
}

function openNav() {
    document.getElementById("mobile_menu").style.width = "100%";
}

function closeNav() {
    document.getElementById("mobile_menu").style.width = "0%";
}