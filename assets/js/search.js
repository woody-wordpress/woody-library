import $ from 'jquery';

$('.esSearch-button').click(function() {
    setTimeout(() => {
        $('#esSearch-input').focus();
    }, 1200);
});

$('.woody-component-esSearch').each(function() {
    var $formWrapper = $(this).find('.form-wrapper'),
        $listWrapper = $(this).find('.list-wrapper'),
        scrolling = false,
        currentTop = 0,
        delta = 80,
        formOffset = $formWrapper.offset().top;

    // Manage events on scroll
    var eventsOnScroll = function() {
        currentTop = $(window).scrollTop();
        isScrolled(currentTop);
        scrolling = false;
    };

    // Add class if website is scrolled
    var isScrolled = function(currentTop) {
        if (currentTop - delta > formOffset) {
            $formWrapper.addClass('is-top');
            $listWrapper.css('padding-top', $formWrapper.outerHeight(true));
        } else {
            $formWrapper.removeClass('is-top');
            $listWrapper.css('padding-top', '0');
        }
    };

    $(window).on("scroll", function() {
        if (!scrolling) {
            scrolling = true;
            !window.requestAnimationFrame ?
                setTimeout(eventsOnScroll, 250) :
                requestAnimationFrame(eventsOnScroll);
        }
    });
});
