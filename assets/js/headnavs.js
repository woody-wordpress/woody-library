import $ from 'jquery';
import WoodyFilter from './filter';

/** --- Hooks --- */
//Hook to disable the scroll classes & menu behaviors
/* In Child theme :
WoodyFilter.add('header_class_disable', function() {
    return true;
});
*/
//Hook to change scroll delta value
/* In Child theme :
WoodyFilter.add('header_scroll_delta', function() {
    return 40;
});
*/
//Hook to change scroll offset value
/* In Child theme :
WoodyFilter.add('header_scroll_delta', function() {
    return 250;
});
*/

$('.woody-component-headnavs').each(function() {
    var windowWidth = window.innerWidth;
    var $body = $('body:not(.fullScrolled)'),
        $mainContent = $('#main-content'),
        $this = $(this),
        headerHeight = $this.height(),
        scrolling = false,
        previousTop = 0,
        currentTop = 0,
        scrollDelta = 2, // Max scroll up
        scrollOffset = 60; // Max scroll down

    // --- Hooks modifiers :
    if (typeof WoodyFilter.apply('header_scroll_delta') !== 'undefined') {
        scrollDelta = WoodyFilter.apply('header_scroll_delta');
    }
    if (typeof WoodyFilter.apply('header_scroll_offset') !== 'undefined') {
        scrollOffset = WoodyFilter.apply('header_scroll_offset');
    }

    // Good for transparent headers !
    if (typeof WoodyFilter.apply('header_headnavs_height') !== 'undefined') {
        headerHeight = WoodyFilter.apply('header_headnavs_height');
    }
    // ---

    if (windowWidth > 1024) {

        if ($mainContent.hasClass('front_page')) {
            var visualPageTop = $('#main-content').find('.home-slider');
            var visualPageTopTitles = visualPageTop.find('.landswpr-titles');
            var visualPageTopHeight = window.innerHeight;
        } else {
            var visualPageTop = $('#main-content').find('.woody-component-hero.hero-full-height');
            var visualPageTopTitles = visualPageTop.find('.hero-titles');
            var visualPageTopHeight = window.innerHeight - headerHeight;
        }
        // Check if wpadminbar.. then remove its height from full height
        visualPageTopHeight = ($('#wpadminbar').length) ? visualPageTopHeight - $('#wpadminbar').height() : visualPageTopHeight;
        var visualPageTopToogleMovie = visualPageTop.find('.toggling-movie-container');

        if (visualPageTop.length != 0) {
            if (visualPageTop.find('.noFullScreen').length == 0) {
                visualPageTop.css({
                    'height': visualPageTopHeight,
                    'overflow': 'hidden'
                });
                visualPageTop.find('.imageObject').css({
                    'height': '100%',
                    'overflow': 'hidden'
                });
                visualPageTop.find('.imageObject .imageObject-img').css({
                    'position': 'absolute',
                    'left': '50%',
                    'top': '50%',
                    'transform': 'translateX(-50%) translateY(-50%)',
                    'min-height': '100%',
                    'min-width': '100%',
                    'width': 'auto',
                    'max-width': 'none'
                });
                visualPageTop.find('.videoObject').css({
                    'height': '100%',
                    'overflow': 'hidden'
                });
                visualPageTop.find('.videoObject .videoObject-video').css({
                    'position': 'absolute',
                    'left': '50%',
                    'top': '50%',
                    'transform': 'translateX(-50%) translateY(-50%)',
                    'height': '100%',
                    'width': 'auto',
                    'min-height': '100%',
                    'min-width': '100%',
                    'max-width': 'none'
                });
            }

            if (visualPageTopTitles.length != 0) {
                visualPageTopTitles.css('opacity', '1');
            }
            if (visualPageTopToogleMovie.length != 0) {
                visualPageTopToogleMovie.css('opacity', '1');
            }

        }
        if (typeof WoodyFilter.apply('header_class_disable') == 'undefined') { //Hook
            $body.addClass('is-top').css('padding-top', headerHeight);
            $this.css('position', 'fixed');
        }
    }

    // Check scroll direction and add hidden class
    var checkNavigation = function(currentTop) {
        if (previousTop - currentTop > scrollDelta) {
            // Up
            $body.removeClass("scrolling-down").addClass('scrolling-up');
        } else if (currentTop - previousTop > scrollDelta && currentTop > scrollOffset) {
            // Down
            $body.removeClass("scrolling-up").addClass("scrolling-down");
        }
    };

    // Manage events on scroll
    var eventsOnScroll = function() {
        currentTop = $(window).scrollTop();
        isScrolled(currentTop);
        checkNavigation(currentTop);
        previousTop = currentTop;
        scrolling = false;
    };

    // Add class if website is scrolled
    var isScrolled = function(currentTop) {
        if ((currentTop + window.innerHeight) > $(document).height() - 10) {
            $body.addClass("fullScrolled");
        } else {
            $body.removeClass("fullScrolled");
        }
        if (currentTop > scrollDelta && currentTop > scrollOffset) {
            $body.removeClass("is-top").addClass("is-scrolled");
        } else if (currentTop < scrollDelta) {
            $body.removeClass("is-scrolled");
            setTimeout(function() {
                $body.addClass("is-top");
            }, 20);
        }
    };
    if (typeof WoodyFilter.apply('header_class_disable') == 'undefined') { //Hook
        $(window).on("scroll", function() {
            if (!scrolling) {
                scrolling = true;
                !window.requestAnimationFrame ?
                    setTimeout(eventsOnScroll, 250) :
                    requestAnimationFrame(eventsOnScroll);
            }
        });
    }

});

// Change title menu
$('.woody-component-header.tpl_02 .menu-icon').click(function() {
    $('.title-bar-title > span').toggleClass('hide');
});
