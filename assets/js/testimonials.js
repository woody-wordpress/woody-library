import $ from 'jquery';

$('.woody-component-testimonials').each(function() {
    const $this = $(this);
    const swiperQuoteContainer = $this.find('.testimonials-quote');
    const swiperImgContainer = $this.find('.testimonials-img');

    let titles = [];
    let swiperOptionsQuote = {};
    let swiperOptionsImg = {};
    let swiperOptions = {
        keyboard: {
            enabled: true
        },
        fadeEffect: {
            crossFade: true
        },
        effect: 'fade'
    };

    if ($this.hasClass('tpl_01')) {
        swiperOptionsQuote = {
            autoHeight: window.innerWidth < 1024 ? true : false,
            pagination: {
                el: $this.find(".testimonials-pagination"),
                clickable: true,
                bulletClass: 'testimonials-pagination-item',
                bulletActiveClass: 'active',
                clickableClass: 'testimonials-pagination-clickable',
                modifierClass: 'testimonials-pagination-',
                renderBullet: function(index) {
                    $this.find(".testimonials-quote .swiper-slide").each(function(i) {
                        titles.push($(this).attr("testimony-title"));
                    });

                    let paginationItem = '<div class="testimonials-pagination-item">';
                    paginationItem += '<span class="pagination-title">' + titles[index] + '</span><span class="pagination-bullet"></span>';
                    paginationItem += '</div>';

                    return paginationItem;
                }
            },
            navigation: {
                nextEl: $this.parent().find('.testimonials-button-next')[0],
                prevEl: $this.parent().find('.testimonials-button-prev')[0]
            }
        };
    }

    // Merge options
    $.extend(swiperOptionsImg, swiperOptions);
    $.extend(swiperOptionsQuote, swiperOptions);

    // Init Swiper
    var swiperImg = new Swiper(swiperImgContainer, swiperOptionsImg);
    var swiperQuote = new Swiper(swiperQuoteContainer, swiperOptionsQuote);

    // Manage Controller
    swiperImg.on('slideChangeTransitionStart', function() {
        swiperQuote.slideTo(this.realIndex);
    });
    swiperQuote.on('slideChangeTransitionStart', function() {
        swiperImg.slideTo(this.realIndex);
    });
});
