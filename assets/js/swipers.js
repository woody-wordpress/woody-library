import $ from "jquery";
import Swiper from "swiper";

// Define Swiper and swiperIndex as a global window var
window.swiper = [];
var swiperIndex = 0;

// Init Swiper plugin
$.fn.initSwiper = function ( options )
{

    var $el = $( this ),
        $slides = $el.find( '.swiper-slide' );
    // Only init Swiper if slider contains more than 1 slide
    if ( $slides.length > 1 ) {
        $el.each( function ()
        {
            // Make swipers distincts
            $( this ).attr( 'data-index', swiperIndex );

            // Default params changed if swiper are nested => because of the duplicate created by the loop
            var isNested = $( this ).children().find( ".swiper-container" ).length !== 0;
            var hasPagination = $( this ).hasClass( 'has-pagination' );

            // Set default options
            var defaultOptions = {
                loop: isNested ? false : true,
                centeredSlides: isNested ? false : true,
                keyboard: {
                    enabled: true
                },
                navigation: {
                    nextEl: $( this ).parent().find( '.swiper-button-next' )[ 0 ],
                    prevEl: $( this ).parent().find( '.swiper-button-prev' )[ 0 ]
                },
                thumbs: hasPagination ? {
                    swiper: {
                        el: $( $( this ).find( '.swiper-thumbs .swiper-container' ) ),
                        slidesPerView: 3,
                        spaceBetween: 15,
                        loop: true,
                        watchSlidesVisibility: true,
                        watchSlidesProgress: true,
                    }
                } : '',
            };

            // Get option params from current call and merge with default
            var swiperOptions = $.extend( defaultOptions, options );

            // Get options created in the DOM and merge with default
            var tplOptions = $( this ).data( "options" );
            $.extend( swiperOptions, tplOptions );

            // New Swiper instance for current element
            var slider = new Swiper( this, swiperOptions );

            // Init events
            slider.on( "slideChangeTransitionStart", function ()
            {
                // Pause slider and play video, then start slider again
                manageSwiperSlideVideo( this, swiperOptions );
            } );

            // Pushs slides in the global swiper var
            swiper.push( slider );

            if ( $( this ).hasClass( 'woody-swiper' ) && window.innerWidth < 1024 ) {
                $( this ).parent().find( 'div[class^="swiper-nav"]' ).remove();
                swiper[ swiperIndex ].destroy();
            }
            swiperIndex++
        } );
    } else {
        // If there is a video, loop and play it
        var $slideVideo = $slides.find( ".videoObject-video" );
        if ( $slideVideo.length !== 0 ) {
            var video = $slideVideo[ 0 ];
            video.loop = true;
            video.play();
        }
    }
};

/**
 *
 * manageSwiperSlideVideo() : Manage videos in slides(pause slider and play video, then start slider again)
 *
 * @params: sliderInstance [Object object]
 */
function manageSwiperSlideVideo( sliderInstance, sliderOptions )
{

    var sliderAutoplay = ( sliderOptions.hasOwnProperty( 'autoplay' ) ) ? true : false,
        $allVideos = $( sliderInstance.el ).find( ".videoObject-video" ),
        $currentSlide = $( sliderInstance.el ).find( ".swiper-slide-active" ),
        $video = $currentSlide.find( ".videoObject-video" );

    if ( $allVideos.length !== 0 ) $allVideos[ 0 ].pause();

    if ( $video.length !== 0 ) {

        // If autoplay stop it
        if ( sliderAutoplay ) sliderInstance.autoplay.stop();

        // Play video
        $video[ 0 ].play();

        // When current video ended restart slider autoplay
        $video.bind( 'ended', function ()
        {
            $video[ 0 ].load();
            // Slide next
            sliderInstance.slideNext();
            // If autoplay restart it
            if ( sliderAutoplay ) sliderInstance.autoplay.start();
        } );
    } else {
        // Restart autoplay if set and you slide manualy after a video slide
        if ( sliderAutoplay ) sliderInstance.autoplay.start();
    }

}

// Disallow click behind prev and next buttons
// $(".swiper-button-next", "swiper-button-prev").click(function(e) {
//     e.stopPropagation();
// });

// Init swipers in tabs when a tabs becomes active
$( document ).on( "change.zf.tabs", function ( e )
{
    $( e.target.nextElementSibling ).find( ".is-active" ).find( ".woody-component" ).each( function ()
    {
        var $swiperWrapper = $( this ).find( ".swiper-container" );
        if ( $swiperWrapper.length != 0 ) {
            var index = $swiperWrapper.data( 'index' );
            swiper[ index ].update();
        }
    } );
} );

// Basic Swipers
$( ".woody-swiper" ).initSwiper( {
    preloadImages: false,
    watchSlidesProgress: true,
    watchSlidesVisibility: true,
    lazy: {
        loadPrevNext: true,
    },
} );

// Landing Swipers 01 and 05
$( ".woody-component-landswpr.tpl_01 .woody-landing-swiper, .woody-component-landswpr.tpl_05  .woody-landing-swiper, .woody-component-landswpr.tpl_04  .woody-landing-swiper, .woody-component-landswpr.tpl_06  .woody-landing-swiper" ).each( function ()
{
    $( this ).initSwiper( {
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
    } );
} );

// Landing Swipers 02
$( ".woody-component-landswpr.tpl_02 .woody-landing-swiper" ).each( function ()
{
    $( this ).initSwiper( {
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        speed: 500,
        pagination: {
            el: $( this ).find( ".swiper-pagination" )[ 0 ],
            clickable: true,
            bulletClass: 'swiper-pagination-item',
            bulletActiveClass: 'active',
            clickableClass: 'swiper-pagination-clickable',
            modifierClass: 'swiper-pagination-',
            renderBullet: function ( index, className )
            {
                var slideIndex = index,
                    number = ( index <= 8 ) ? '0' + ( slideIndex + 1 ) : ( slideIndex + 1 ),
                    paginationItem = '<span class="swiper-pagination-item">';
                paginationItem += '<span class="pagination-number">' + number + '</span>';
                paginationItem = ( index <= 8 ) ? paginationItem + '<span class="pagination-separator"><span class="pagination-separator-loader"></span></span>' : paginationItem;
                paginationItem += '</span>';
                return paginationItem;
            },
        },
    } );
} );

// Landing Swipers 03
$( ".woody-component-landswpr.tpl_03 .woody-landing-swiper" ).each( function ()
{
    $( this ).initSwiper( {
        autoplay: {
            delay: 5000,
            // disableOnInteraction: false,
        },
        loop: false,
        speed: 500,
        parallax: true,
        pagination: {
            el: $( this ).find( ".swiper-pagination" )[ 0 ],
            clickable: true,
            bulletClass: 'swiper-pagination-item',
            bulletActiveClass: 'active',
            clickableClass: 'swiper-pagination-clickable',
            modifierClass: 'swiper-pagination-',
            renderBullet: function ( index )
            {
                var titles = [],
                    pretitles = [];

                $( ".swiper-wrapper .swiper-slide" ).each( function ( i )
                {
                    titles.push( $( this ).find( ".landswpr-title" ).text() );
                    pretitles.push( $( this ).find( ".landswpr-pretitle" ).text() );
                } );
                var paginationItem = '<span class="swiper-pagination-item">';

                paginationItem += ( index <= 4 ) ? '<span class="pagination-pretitle">' + pretitles[ index ] + '</span><span class="pagination-title">' + titles[ index ] + '</span>' : '';

                paginationItem = ( index <= 4 ) ? paginationItem + '<span class="pagination-separator"><span class="pagination-separator-loader"></span></span>' : paginationItem;

                paginationItem += '</span>';

                return paginationItem;
            },
        },
    } );

    // Parallax effect
    var parallaxItem = $( this ).find( ".landswpr-texts > span" );
    parallaxItem.attr( {
        'data-swiper-parallax-x': "-75",
        'data-swiper-parallax-duration': "800"
    } );
} );
