if (!document.querySelector('body').classList.contains('menus-v2')) {
    var menuToggler = document.querySelector('.woody-component-mobile-menu .menuToggler');

    if (menuToggler) {
        menuToggler.addEventListener('click', function () {
            document.querySelector('body').classList.toggle('mobile-menu-open');
        });
    }
}
