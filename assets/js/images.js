import $ from 'jquery';

if (window.innerWidth > 767) {
    $('#main-content .page-section .section-layout-wrapper .overlayedCard, #main-content .page-section .section-layout-wrapper .woody-component-gallery .mediaCard').each(function() {
        $(document).on('lazyloaded', function(e) {
            var imageObject = $(e.target).parent('.imageObject');
            if (imageObject.height() > $(e.target).height()) {
                fitImgtoContainer(imageObject, $(e.target), 'height');
            } else if (imageObject.width() > $(e.target).width()) {
                fitImgtoContainer(imageObject, $(e.target), 'width');
            }
        });
    });
}

function fitImgtoContainer(imageObject, imageObjectImg, attribute) {
    var ratio = imageObject[attribute]() / imageObjectImg[attribute]();
    imageObjectImg.css({
        'transform': 'scale(' + ratio + ')',
        'transform-origin': 'center top'
    });
}

if (window.innerWidth <= 768) {
    $(document).on('lazybeforeunveil', function(event) {
        tinySquareImg($(event.target));
    });
}

var tinySquareImg = function($el) {
    if ($el.data('tiny-square-url')) {
        var tinySquareUrl = $el.data('tiny-square-url');
        $el.attr('src', tinySquareUrl).attr('src-set', tinySquareUrl + ' 360w').attr('data-src', tinySquareUrl).attr('data-srcset', tinySquareUrl + ' 360w')
    }
}
