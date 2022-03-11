import $ from 'jquery';

// if (window.innerWidth > 767) {
//     $('#main-content .page-section .section-layout-wrapper .overlayedCard, #main-content .page-section .section-layout-wrapper .woody-component-gallery .mediaCard').each(function() {
//         $(document).on('lazyloaded', function(e) {
//             var imageObject = $(e.target).parent('.imageObject');
//         });
//     });
// }

if (window.innerWidth <= 768) {
    $(document).on('lazybeforeunveil', function (event) {
        if (!($(event.target).parent().hasClass('noRespCrop'))) {
            tinySquareImg($(event.target));
        }
        mobileImg($(event.target));
    });
}

var mobileImg = function ($el) {
    if ($el.data('mobile-img-url')) {
        var mobileImgUrl = $el.data('mobile-img-url');
        $el.attr('src', mobileImgUrl).attr('src-set', mobileImgUrl + ' 360w').attr('data-src', mobileImgUrl).attr('data-srcset', mobileImgUrl + ' 360w');
    }
}

var tinySquareImg = function ($el) {
    if ($el.data('tiny-square-url')) {
        var tinySquareUrl = $el.data('tiny-square-url');
        $el.attr('src', tinySquareUrl).attr('src-set', tinySquareUrl + ' 360w').attr('data-src', tinySquareUrl).attr('data-srcset', tinySquareUrl + ' 360w')
    }
}
