import $ from 'jquery';
import WoodyFilter from './filter';


$('.page-section .woody-component-summary.fixed-summary').each(function() {
    var $el = $(this);
    //Apply Filter summary_offset_modifier
    var summary_offset_modifier = WoodyFilter.apply('summary_offset_modifier'); //Hook var

    var offset = $el.offset().top - summary_offset_modifier;
    var elHeight = $el.height();
    $(window).scroll(function(e) {
        var isPositionFixed = ($el.css('position') == 'fixed');
        if ($(window).scrollTop() > offset && !isPositionFixed) {
            WoodyFilter.apply('summary_start_fixed', $el); //Hook function
            $el.addClass('isFixed');            
            // $('.site-content').css('padding-top', elHeight + 'px');
        }
        if ($(window).scrollTop() < offset && isPositionFixed) {
            WoodyFilter.apply('summary_stop_fixed', $el); //Hook function
            $el.removeClass('isFixed');
            // $('.site-content').css('padding-top', 0);
        }
    });
});

// TODO : optimize with code below
$('.woody-component-summary').each(function() {
    var $summary = $(this);
    if (window.innerWidth >= 1024) {
        var $menu = $summary.find('.menu');

        var initScroller = function() {

            if ($summary.find('.scroller.right').length == 0) {
                $summary.append('<span class="scroller right wicon wicon-025-suivant"></span>');
            }

            $('.scroller.right').click(function() {
                $menu.animate({
                    scrollLeft: $menu[0].scrollWidth - $menu[0].offsetWidth
                });
                $summary.append('<span class="scroller left wicon wicon-026-precedent"></span>');
                initScroller();
                $(this).remove();
            });

            $('.scroller.left').click(function() {
                $menu.animate({
                    scrollLeft: 0
                });
                if ($summary.find('.scroller.left').length == 0) {
                    $summary.append('<span class="scroller right wicon wicon-025-suivant"></span>');
                }
                initScroller();
                $(this.remove());
            });

        }

        if (typeof $menu[0] != 'undefined' && $menu[0].offsetWidth < $menu[0].scrollWidth) {
            console.log('add the span');
            initScroller();
        }
    }

    // On récupère la position et la hauteur de chaque section ajoutée au sommaire
    var summaryAnchors = {};
    $summary.find('.anchor').each(function() {
        var anchorId = $(this).data('section');
        summaryAnchors[anchorId] = {
            'offset': $(anchorId).offset().top,
            'height': $(anchorId).height()
        }
    });

    // Au scroll, on vérifie si l'on est sur une section active
    $(window).scroll(function() {
        for (const [key, value] of Object.entries(summaryAnchors)) {
            if ($(window).scrollTop() < (value.offset + value.height) && $(window).scrollTop() > value.offset) {
                $summary.find('[data-section="' + key + '"]').addClass('active');
            } else {
                $summary.find('[data-section="' + key + '"]').removeClass('active');
            }
        }
    });

});
