function openNav() {
    document.getElementById("mobile_menu").style.height = "100%";
}

function closeNav() {
    document.getElementById("mobile_menu").style.height = "0%";
}

mLogin = document.getElementById("mLogin");
mRegister = document.getElementById("mRegister");

mLogin.onclick = function() {
    closeNav();
    lmodal.style.display = "block";
}

mRegister.onclick = function() {
    closeNav();
    rmodal.style.display = "block";
}