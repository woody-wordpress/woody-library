import $ from 'jquery';

$('.swResp').each(function() {
    var $this = $(this),
        swiperWrapper = $this.find('.swRespW'),
        swiperLength = swiperWrapper.children().length;

    if (window.innerWidth < 1024 && swiperLength > 1) {
        // Multirows case
        var $multirows = $($this.find('.multiRows'));
        if ($multirows.length != 0) {
            $multirows.find('.grid-y>.cell').removeClass().addClass('swRespS').unwrap('.grid-y').unwrap('.multiRows');
        }

        // Remove visualModifier div that causes bug
        if ($this.children().first().hasClass('visualModifier')) {
            swiperWrapper.unwrap();
        }

        if ((window.innerWidth <= 640) || (window.innerWidth > 640 && swiperLength > 2)) {
            $this.append('<div class="swiper-pagination"></div>').append('<div class="swiper-nav"><div class="swiper-button-prev" tabindex="0" role="button" aria-label="Previous slide"><i class="wicon wicon-026-precedent" aria-hidden="true"></i></div><div class="swiper-button-next" tabindex="0" role="button" aria-label="Next slide"><i class="wicon wicon-025-suivant" aria-hidden="true"></i></div></div>');
        }
        var $the_wrapper = $($this.find('.swRespW'));
        if ($the_wrapper.length != 0) {
            $the_wrapper.removeClass('grid-x').addClass('swiper-wrapper');
            var $theSlide = $($the_wrapper).find('>.swRespS');
            if ($theSlide.length != 0) {
                $theSlide.removeClass('cell').addClass('swiper-slide');
            }

            var options = {
                spaceBetween: 25,
                loop: false,
                slidesPerView: 2,
                slidesPerGroup: 2,
                breakpoints: {
                    640: {
                        slidesPerView: 1,
                        slidesPerGroup: 1
                    }
                },
                navigation: {
                    nextEl: $(this).parent().find('.swiper-button-next')[0],
                    prevEl: $(this).parent().find('.swiper-button-prev')[0]
                },
                pagination: {
                    el: '.swiper-pagination',
                    type: 'bullets',
                    dynamicBullets: true,
                    clickable: true
                },
            };

            // New Swiper instance for current element
            var responsive_slider = new Swiper(this, options);

        }

        $(window).on('change.zf.tabs', function(e) {
            var $target = $(e.target);
            if ($target.find('.swResp')) {
                responsive_slider.update();
            }
        });

    }
});
