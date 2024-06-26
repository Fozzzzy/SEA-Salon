document.addEventListener('DOMContentLoaded', function () {
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