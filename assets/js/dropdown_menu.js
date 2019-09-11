import $ from 'jquery';

// On click main menu link
$('.is-dropdown-submenu-parent > a').click(function(e) {
    var $childrenDropdown = $($(this).siblings('.is-dropdown-submenu'));

    $childrenDropdown.toggleClass('js-dropdown-active');
    e.preventDefault();

    $('body').toggleClass('menu-is-open');
    $(".woody-component-header").toggleClass('submenu-open');

    if (!$('.is-dropdown-submenu-parent').hasClass('is-active')) {
        $('.is-dropdown-submenu-parent').addClass('is-active');
    }
});

// On show dropdown menu
$(document).on("show.zf.dropdownmenu", function(e) {
    var $headerHeight = $('.woody-component-headnavs').height();
    var $dropdown = $(this).find('.js-dropdown-active');

    if (window.innerHeight < ($dropdown.height() + $headerHeight)) {
        $dropdown.css('minHeight', 'calc(100vh - ' + $headerHeight + 'px)');
        $dropdown.css('overflow', 'auto');
    }

    $('body').addClass('menu-is-open');
    $(".woody-component-header").addClass('submenu-open');

});

// Hide the dropdown menu
function hideDropdown() {
    if ($('body').hasClass('menu-is-open')) {
        var $childrenDropdown = $($('.is-dropdown-submenu-parent > a').siblings('.is-dropdown-submenu'));
        var $parentDropdown = $('.is-dropdown-submenu-parent');

        $childrenDropdown.removeClass('js-dropdown-active');
        $parentDropdown.removeClass('is-active');
        $parentDropdown.attr('data-is-click', 'false');

        $('body').removeClass('menu-is-open');
        $(".woody-component-header").removeClass('submenu-open');
    }
}

$(document).on("scroll", function() {
    if ($('body').hasClass('scrolling-down')) {
        hideDropdown();
    }
});

// On close dropdown menu AND click outside dropdown menu
$(document).on("close.zf.dropdownmenu click.zf.dropdownmenu", function () {
    if (!$('.woody-component-header').hasClass('woody-burger')) {
        hideDropdown();
    }
});
