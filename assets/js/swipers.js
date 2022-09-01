import $ from "jquery";
import Swiper from "swiper";

// Define Swiper and swiperIndex as a global window var
window.swiper = [];
var swiperIndex = 0;
$.fn.extend({
    // Init Swiper plugin
    initSwiper: function (options) {
        var $el = this,
            $slides = $el.find('.swiper-slide');

        // Only init Swiper if slider contains more than 1 slide
        if ($slides.length > 1) {
            $el.each(function () {
                // Make swipers distincts
                $(this).attr('data-index', swiperIndex);

                // Default params changed if swiper are nested => because of the duplicate created by the loop
                var isNested = $(this).children().find(".swiper-container").length !== 0;

                // Thumbs component
                var hasThumbs = $(this).hasClass('has-thumbs') && $(this).find('.swiper-thumbs').length > 0 ? true : false,
                    thumbsOptions = {};

                if (hasThumbs) {
                    thumbsOptions = {
                        thumbs: {
                            swiper: {
                                el: $($(this).find('.swiper-thumbs .swiper-container')),
                                slidesPerView: 4,
                                spaceBetween: 5,
                                loop: isNested ? false : true,
                                watchSlidesVisibility: true,
                                watchSlidesProgress: true
                            }
                        }
                    };
                }

                // Pagination component
                var hasPagination = $(this).hasClass('has-pagination') && $(this).parent().find('.swiper-pagination').length > 0 ? true : false,
                    paginationType = $(this).parent().find('.swiper-pagination').attr('swiper-pagination-type'),
                    paginationOptions = {};

                if (hasPagination) {
                    var paginationOptions = $(this).parent().manageSwiperPagination(paginationType);
                }

                // Set default options
                var defaultOptions = {
                    loop: isNested ? false : true,
                    centeredSlides: false,
                    keyboard: {
                        enabled: true
                    },
                    navigation: {
                        nextEl: $(this).parent().find('.swiper-button-next')[0],
                        prevEl: $(this).parent().find('.swiper-button-prev')[0]
                    }
                };

                // Get options params from current call and merge with default
                var swiperOptions = $.extend(defaultOptions, thumbsOptions, paginationOptions, options);

                // Get options created in the DOM and merge with default
                var tplOptions = $(this).data("options");
                $.extend(swiperOptions, tplOptions);

                // New Swiper instance for current element
                var slider = new Swiper(this, swiperOptions);
                $(this).data('swiper', slider); //Allows usage of API outside of here
                $(this)[0].dispatchEvent(new Event("swiperInit"));// Allows detection of swiper initialization

                // Init events
                slider.on("slideChangeTransitionStart", function () {
                    // Pause slider and play video, then start slider again
                    $(this).manageSwiperSlideVideo(swiperOptions);
                });

                // Pushs slides in the global swiper var
                swiper.push(slider);


                // if ($(this).hasClass('woody-swiper') && ($(this).hasClass('has-pagination') || $(this).hasClass('has-navigation')) && window.innerWidth < 1024) {
                //     $(this).parent().find('div[class^="swiper-nav"]').remove();
                //     $(this).parent().find('div[class^="swiper-pagination"]').remove();
                //     swiper[swiperIndex].destroy();
                // }

                swiperIndex++
            });
        } else {
            // If there is a video, loop and play it
            var $slideVideo = $slides.find(".videoObject-video");
            if ($slideVideo.length !== 0) {
                var video = $slideVideo[0];
                video.loop = true;
                video.play();
            }
        }
    },

    // Manage Swiper video
    manageSwiperSlideVideo: function (sliderOptions) {

        var sliderAutoplay = (sliderOptions.hasOwnProperty('autoplay')) ? true : false,
            $allVideos = $($(this).el).find(".videoObject-video"),
            $currentSlide = $($(this).el).find(".swiper-slide-active"),
            $video = $currentSlide.find(".videoObject-video");

        if ($allVideos.length !== 0) $allVideos[0].pause();

        if ($video.length !== 0) {

            // If autoplay stop it
            if (sliderAutoplay) $(this)[0].autoplay.stop();

            // Play video
            $video[0].play();

            // When current video ended restart slider autoplay
            $video.bind('ended', function () {
                $video[0].load();
                // Slide next
                $(this).slideNext();
                // If autoplay restart it
                if (sliderAutoplay) $(this)[0].autoplay.start();
            });
        } else {
            // Restart autoplay if set and you slide manualy after a video slide
            if (sliderAutoplay) $(this)[0].autoplay.start();
        }
    },

    // Manage Swiper pagination
    manageSwiperPagination: function (paginationType) {
        var paginationOptions = {},
            paginationTypeOptions = {},
            defaultPaginationOptions = {
                el: $(this).find('.swiper-pagination'),
                type: paginationType == 'loader' ? 'bullets' : paginationType,
                clickable: true
            };

        switch (paginationType) {
            case 'fraction':
                var fraction = function renderFraction(currentClass, totalClass) {
                    return '<span class="' + currentClass + '"></span>' + '<span class="' + totalClass + '"></span>';
                };

                paginationTypeOptions.renderFraction = fraction;
                break;
            case 'progressbar':
                var progressbar = function renderProgressBar(progressbarFillClass) {
                    return '<span class="' + progressbarFillClass + '"></span>';
                };

                paginationTypeOptions.renderProgressBar = progressbar;
                break;
            case 'loader':
                var loader = function renderBullet(index) {
                    var autoplayIsActive = this.params.autoplay,
                        autoplay = this.params.autoplay.delay,
                        speed = this.params.speed,
                        autoplayParams = 'style="--swiper-speed:' + speed + 'ms;--swiper-autoplay:' + autoplay + 'ms"',
                        paginationRender = '',
                        number = index + 1;

                    paginationRender = '<span class="custom-pagination-item"' + autoplayParams + '">';
                    paginationRender += '<span class="custom-pagination-number">' + number.toString().padStart(2, '0') + '</span>';

                    if (autoplayIsActive) {
                        paginationRender = paginationRender + '<span class="custom-pagination-loader"></span>'
                    }

                    paginationRender = paginationRender + '</span>'

                    return paginationRender;
                };

                paginationTypeOptions.bulletClass = 'custom-pagination-item';
                paginationTypeOptions.bulletActiveClass = 'active';
                paginationTypeOptions.modifierClass = 'swiper-pagination-custom-';
                paginationTypeOptions.clickable = false;
                paginationTypeOptions.renderBullet = loader;
                break;
            default:
                paginationTypeOptions.dynamicBullets = true;
                paginationTypeOptions.clickable = true;
                break;
        }

        paginationOptions.pagination = $.extend(defaultPaginationOptions, paginationTypeOptions);

        return paginationOptions;
    }
})

// Init swipers in tabs when a tabs becomes active
$('[data-tabs]').on("change.zf.tabs", function (e) {
    $(this).closest('.woody-component-tabs').find(".tabs-panel.is-active").find(".woody-component").each(function () {
        var $swiperWrapper = $(this).find(".woody-swiper");
        if ($swiperWrapper.length != 0) {
            var index = $swiperWrapper.data('index');
            swiper[index].update();
        }
    });
});

// Init woody-swipers only on large devices. Small devices goes with swResp classes
if (window.innerWidth >= 1024) {
    // Basic Swipers
    $("body:not(.single-touristic_sheet) .woody-swiper").initSwiper({
        preloadImages: false,
        watchSlidesProgress: true,
        watchSlidesVisibility: true,
        lazy: {
            loadPrevNext: true,
        },
    });
} else {
    // Specific woody-swipers for small devices
    $('.woody-component-story .woody-swiper').initSwiper({
        preloadImages: false,
        watchSlidesProgress: true,
        watchSlidesVisibility: true,
        lazy: {
            loadPrevNext: true,
        },
    });
}

// Init the swiper controls outside the wrapper
$('.swiper-controls-offset').each(function () {
    var swiperWrapper = $(this).find('.woody-swiper'),
        paginationWrapper = $(this).find('.swiper-pagination'),
        paginationType = paginationWrapper.attr('swiper-pagination-type'),
        options = {
            navigation: {
                nextEl: $(this).find('.swiper-button-next')[0],
                prevEl: $(this).find('.swiper-button-prev')[0]
            }
        },
        paginationOptions = $(this).manageSwiperPagination(paginationType),
        swiperOptions = $.extend(options, paginationOptions);

    swiperWrapper.initSwiper(swiperOptions);
});

// Landing Swipers 01 and 05
$(".woody-component-landswpr.tpl_01 .woody-landing-swiper, .woody-component-landswpr.tpl_05  .woody-landing-swiper, .woody-component-landswpr.tpl_04  .woody-landing-swiper, .woody-component-landswpr.tpl_06  .woody-landing-swiper, .woody-component-landswpr.tpl_09 .woody-landing-swiper").each(function () {
    $(this).initSwiper({
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
    });
});

// Landing Swipers 02
$(".woody-component-landswpr.tpl_02 .woody-landing-swiper").each(function () {
    $(this).initSwiper({
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        speed: 500,
        pagination: {
            el: $(this).find(".swiper-pagination")[0],
            clickable: true,
            bulletClass: 'swiper-pagination-item',
            bulletActiveClass: 'active',
            clickableClass: 'swiper-pagination-clickable',
            modifierClass: 'swiper-pagination-',
            renderBullet: function (index, className) {
                var slideIndex = index,
                    number = (index <= 8) ? '0' + (slideIndex + 1) : (slideIndex + 1),
                    paginationItem = '<span class="swiper-pagination-item">';
                paginationItem += '<span class="pagination-number">' + number + '</span>';
                paginationItem = (index <= 8) ? paginationItem + '<span class="pagination-separator"><span class="pagination-separator-loader"></span></span>' : paginationItem;
                paginationItem += '</span>';
                return paginationItem;
            },
        },
    });
});

// Landing Swipers 03
$(".woody-component-landswpr.tpl_03 .woody-landing-swiper").each(function () {
    $(this).initSwiper({
        autoplay: {
            delay: 5000,
            // disableOnInteraction: false,
        },
        loop: false,
        speed: 500,
        parallax: true,
        pagination: {
            el: $(this).find(".swiper-pagination")[0],
            clickable: true,
            bulletClass: 'swiper-pagination-item',
            bulletActiveClass: 'active',
            clickableClass: 'swiper-pagination-clickable',
            modifierClass: 'swiper-pagination-',
            renderBullet: function (index) {
                var titles = [],
                    pretitles = [];

                $(".swiper-wrapper .swiper-slide").each(function (i) {
                    titles.push($(this).find(".landswpr-title").text());
                    pretitles.push($(this).find(".landswpr-pretitle").text());
                });
                var paginationItem = '<span class="swiper-pagination-item">';

                paginationItem += (index <= 4) ? '<span class="pagination-pretitle">' + pretitles[index] + '</span><span class="pagination-title">' + titles[index] + '</span>' : '';

                paginationItem = (index <= 4) ? paginationItem + '<span class="pagination-separator"><span class="pagination-separator-loader"></span></span>' : paginationItem;

                paginationItem += '</span>';

                return paginationItem;
            },
        },
    });

    // Parallax effect
    var parallaxItem = $(this).find(".landswpr-texts > span");
    parallaxItem.attr({
        'data-swiper-parallax-x': "-75",
        'data-swiper-parallax-duration': "800"
    });
});

// focus-swiper-fullpage-overlayed
$(".focus-swiper-fullpage-overlayed .swiper-container").each(function () {
    var $this = $(this);
    $this.initSwiper({
        loop: false,
        parallax: true,
        effect: "fade",
        pagination: {
            el: $this.find(".swiper-pagination")[0],
            clickable: true,
            bulletClass: 'swiper-pagination-item',
            bulletActiveClass: 'active',
            clickableClass: 'swiper-pagination-clickable',
            modifierClass: 'swiper-pagination-',
            renderBullet: function (index) {
                var titles = [],
                    pretitles = [];

                $this.find(".swiper-wrapper .swiper-slide").each(function (i) {
                    titles.push($(this).find(".focus-title").text());
                    pretitles.push($(this).find(".focus-pretitle").text());
                });

                let pageIndex = index + 1;
                if ( pageIndex < 10) {
                    pageIndex = '0' + pageIndex;
                }

                var paginationItem = '<span class="swiper-pagination-item">';

                if($this.find(".swiper-pagination")[0].classList.contains('hasActiveIndex')) {

                    let paginationIndex = '<span class="card-index">' + pageIndex + '</span>';

                    paginationItem += (index <= 4) ? paginationIndex + '<span class="pagination-pretitle">' + pretitles[index] + '</span><span class="pagination-title">' + titles[index] + '</span>' : '';
                } else {
                    paginationItem += (index <= 4) ? '<span class="pagination-pretitle">' + pretitles[index] + '</span><span class="pagination-title">' + titles[index] + '</span>' : '';
                    paginationItem = (index <= 4) ? paginationItem + '<span class="pagination-separator"><span class="pagination-separator-loader"></span></span>' : paginationItem;
                }

                paginationItem += '</span>';

                return paginationItem;
            },
        },
    });
});

// Landing Swipers 08
$(".woody-component-landswpr.tpl_08 .woody-landing-swiper").each(function () {
    $(this).initSwiper({
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        speed: 500,
        pagination: {
            el: $(this).find(".swiper-pagination")[0],
            clickable: true,
            bulletClass: 'swiper-pagination-bullet',
            bulletActiveClass: 'active',
            clickableClass: 'swiper-pagination-clickable',
            modifierClass: 'swiper-pagination-',
            renderBullet: function (index, className) {
                var paginationItem = `<div class="swiper-pagination-bullet"></div>`;
                return paginationItem;
            },
        },
    });
});
