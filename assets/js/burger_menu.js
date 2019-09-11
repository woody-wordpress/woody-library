import $ from 'jquery';

$(document).on('toggled.zf.responsiveToggle', function() {
    $('body').toggleClass('no-scroll toggle-menu-is-open menu-is-open');
});
