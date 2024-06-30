// HAMBURGER MENU
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    console.log('hamburger clicked');
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll("li").forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// NAVBAR SHADOW
document.addEventListener('DOMContentLoaded', () => {
    var headers = document.querySelectorAll('header');

    window.addEventListener('scroll', function () {
        headers.forEach(function (header) {
            if (window.scrollY > 0) {
                header.classList.add('shadow');
            } else {
                header.classList.remove('shadow');
            }
        });
    });
});

// Logout
const logoutButton = document.querySelector('.logout-btn');
logoutButton.addEventListener('click', () => {
    window.location.href = 'login.html';
});