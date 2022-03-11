import $ from 'jquery';
import WoodyFilter from './filter';

if (!$('body').hasClass('menus-v2')) {
    // On click main menu link
    $('.is-dropdown-submenu-parent > a').on('click', function(e) {
        $(this).siblings('.is-dropdown-submenu').removeClass('js-dropdown-active');

        if ($(this).hasClass('js-dropdown-active')) {
            $('body').removeClass('menu-is-open');
            $(".woody-component-header").removeClass('submenu-open');
        } else {
            $('body').addClass('menu-is-open');
            $(".woody-component-header").addClass('submenu-open');
        }
        $(this).closest('.is-dropdown-submenu-parent').addClass('is-active');
        e.preventDefault();
    });

    // On show dropdown menu
    $(document).on("show.zf.dropdownmenu", function(e) {
        let headerHeight = $('.woody-component-headnavs').height();
        let dropdown = $(this).find('.js-dropdown-active');

        if (window.innerHeight < (dropdown.height() + headerHeight)) {
            dropdown.css('minHeight', 'calc(100vh - ' + headerHeight + 'px)');
            dropdown.css('overflow', 'auto');
        }

        $('body').addClass('menu-is-open');
        $(".woody-component-header").addClass('submenu-open');
    });

    // Hide the dropdown menu
    function hideDropdown() {
        if ($('body').hasClass('menu-is-open')) {
            $('.is-dropdown-submenu-parent > a').siblings('.is-dropdown-submenu')
                .removeClass('js-dropdown-active');
            $('.is-dropdown-submenu-parent')
                .removeClass('is-active')
                .attr('data-is-click', 'false');

            $('body').removeClass('menu-is-open');
            $(".woody-component-header").removeClass('submenu-open');
        }
    }

    // Apply Filter scroll_hide_menu_modifier
    var scroll_hide_menu_modifier = WoodyFilter.apply('scroll_hide_menu_modifier'); //Hook var
    scroll_hide_menu_modifier = typeof scroll_hide_menu_modifier === 'undefined' ? true : scroll_hide_menu_modifier;
    if (scroll_hide_menu_modifier != false) {
        $(document).on("scroll", function() {
            if ($('body').hasClass('scrolling-down')) {
                hideDropdown();
            }
        });
    }


    // On close dropdown menu AND click outside dropdown menu
    if (scroll_hide_menu_modifier != false) {
        $(document).on("close.zf.dropdownmenu click.zf.dropdownmenu", function () {
            if (!$('.woody-component-header').hasClass('woody-burger')) {
                hideDropdown();
            }
        });
    }

    // Burger menu
    $(document).on('toggled.zf.responsiveToggle', function() {
        $('body').toggleClass('no-scroll toggle-menu-is-open menu-is-open');
    });
}
