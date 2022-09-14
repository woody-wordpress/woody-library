import $ from 'jquery';
import WoodyFilter from './filter';

$('.swResp').each(function () {
    var $this = $(this),
    swiperComponent = $this.parent(),
    swiperWrapper = $this.find('.swRespW'),
    swiperLength = swiperWrapper.children().length;

    if (window.innerWidth < 1024 && swiperLength > 1) {
        // Multirows case
        var $multirows = $($this.find('.multiRows'));
        if ($multirows.length != 0) {

            let y = transformToSlide($multirows.find('.grid-y>.cell'), 'y');
            let x = transformToSlide($multirows.find('.grid-x>.cell'), 'x');

            function transformToSlide(element, direction) {
                element.each((index, el) => {
                    if ($(el).hasClass('no-swRespS')) {
                        element.splice(index, 1);
                        element = [...element, ...$(el).find(`.grid-${direction}>.cell`)];
                    }
                });
                return $(element);
            }

            x.removeClass().addClass('swRespS').unwrap('.grid-x').unwrap('.multiRows').unwrap('.no-swRespS');
            y.removeClass().addClass('swRespS').unwrap('.grid-y').unwrap('.multiRows').unwrap('.no-swRespS');
        }

        // Remove visualModifier div that causes bug
        if ($this.children().first().hasClass('visualModifier')) {
            swiperWrapper.unwrap();
        }

        swiperComponent.find('.swiper-controls').remove();
        $this.unwrap();

        // $this.removeClass('swiper-container');

        var $the_wrapper = $($this.find('.swRespW'));
        if ($the_wrapper.length != 0) {
            $the_wrapper.removeClass('grid-x').addClass('swiper-wrapper');
            var $theSlide = $($the_wrapper).find('>.swRespS');
            if ($theSlide.length != 0) {
                $theSlide.removeClass('cell').addClass('swiper-slide');
            }

            if ($this.attr('data-columns') != undefined) {
                var customSlidesPerView = $this.attr('data-columns') + '.1';
            } else {
                var customSlidesPerView = 1.1;
            }

            var defaultOptions = {},
                tabletOptions = {},
                thumbsOptions = {};

            defaultOptions = {
                // spaceBetween: 25,
                spaceBetween: 15,
                loop: false,
                slidesPerView: 2.1,
                breakpoints: {
                    640: {
                        slidesPerView: customSlidesPerView
                    }
                }
            };

            //la class spv-tablette-1 permet d'afficher 1 seul élément en mode tablette
            if ($this.hasClass('spv-tablette-1')) {
                tabletOptions = {
                    slidesPerView: 1,
                };
            }

            if ($this.hasClass('has-thumbs')) {
                thumbsOptions = {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    thumbs: {
                        swiper: {
                            el: $($(this).find('.swiper-thumbs .swiper-container')),
                            slidesPerView: 3,
                            spaceBetween: 5,
                            loop: false,
                            watchSlidesVisibility: true,
                            watchSlidesProgress: true
                        }
                    },
                    pagination: {}
                };
            }

            var options = $.extend(defaultOptions, tabletOptions, thumbsOptions);

            // Get options created in the DOM and merge with default only for swiper-tabs
            if ($this.parent().hasClass('tabs-swiper')) {
                var tplOptions = $this.data("options");
                $.extend(options, tplOptions);
            }

            var responsiveFocusOptions = WoodyFilter.apply('responsive_focus_options', options);
            options = typeof responsiveFocusOptions === 'undefined' ? options : responsiveFocusOptions;

            // New Swiper instance for current element
            var responsive_slider = new Swiper(this, options);
            $this.data('swiper', responsive_slider);

            $(document).on('lazybeforeunveil', function (event) {
                responsive_slider.update();
            });
        }

        $(window).on('change.zf.tabs', function (e) {
            var $target = $(e.target);
            if ($target.find('.swResp')) {
                setTimeout(function () {
                    responsive_slider.update();
                }, 600);
            }
        });
    }
});

document.querySelectorAll('.mobile-grid-x').forEach((element) => {
    if (window.innerWidth < 1024 ) {
        element.classList.contains('grid-y') ? element.classList.remove('grid-y') : '';
        element.classList.contains('grid-frame') ? element.classList.remove('grid-frame') : '';
        element.classList.contains('grid-padding-y') ? element.classList.add('grid-padding-x') : '';
        element.classList.contains('grid-padding-y') ? element.classList.remove('grid-padding-y') : '';
        element.classList.add('grid-x');
    }
})
