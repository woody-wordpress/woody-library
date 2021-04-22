import $ from 'jquery';

if (window.innerWidth > 767) {
    $('#main-content .page-section .section-layout-wrapper .overlayedCard, #main-content .page-section .section-layout-wrapper .woody-component-gallery .mediaCard').each(function() {
        $(document).on('lazyloaded', function(e) {
            var imageObject = $(e.target).parent('.imageObject');
        });
    });
}

if (window.innerWidth <= 768) {
    $(document).on('lazybeforeunveil', function(event) {
        if (!($(event.target).parent().hasClass('noRespCrop'))) {
            tinySquareImg($(event.target));
        }
        mobileImg($(event.target));
    });
}
var mobileImg = function($el) {
    if ($el.data('mobile-img-url')) {
        var mobileImgUrl = $el.data('mobile-img-url');
        $el.attr('src', mobileImgUrl).attr('src-set', mobileImgUrl + ' 360w').attr('data-src', mobileImgUrl).attr('data-srcset', mobileImgUrl + ' 360w');
    }
}

var tinySquareImg = function($el) {
    if ($el.data('tiny-square-url')) {
        var tinySquareUrl = $el.data('tiny-square-url');
        $el.attr('src', tinySquareUrl).attr('src-set', tinySquareUrl + ' 360w').attr('data-src', tinySquareUrl).attr('data-srcset', tinySquareUrl + ' 360w')
    }
}

function woodyBackgroundImagesCalcRatio() {
    const WOODY_CROPS_RATIOS = [
        { x: 8, y: 1 }, // Ratio 8:1 => Pano A
        { x: 4, y: 1 }, // Ratio 4:1 => Pano B
        { x: 3, y: 1 }, // Ratio 3:1 => Pano C
        { x: 2, y: 1 }, // Ratio 2:1 => Paysage A
        { x: 16, y: 9 }, // Ratio 16:9 => Paysage B
        { x: 4, y: 3 }, // Ratio 4:3 => Paysage C
        { x: 3, y: 4 }, // Ratio 3:4 => Portrait A
        { x: 10, y: 16 }, // Ratio 10:16 => Portrait B
        { x: 1, y: 1 }, // Carré
    ];
    var WOODY_CROPS_VALS = [];
    for (let i = 0; i < WOODY_CROPS_RATIOS.length; i++) {
        const elm = WOODY_CROPS_RATIOS[i];
        WOODY_CROPS_VALS.push(elm.x / elm.y);
    }

    function closest(num, arr) {
        var curr = arr[0];
        var diff = Math.abs(num - curr);
        for (var val = 0; val < arr.length; val++) {
            var newdiff = Math.abs(num - arr[val]);
            if (newdiff < diff) {
                diff = newdiff;
                curr = arr[val];
            }
        }
        return curr;
    }

    function getSize(size) {
        if (size < 440) {
            return '_small';
        } else if (size < 768) {
            return '_medium';
        }
        return '';
    }

    //On  LazyLoad
    $(document).on('lazybeforeunveil', function(event) {
        if ($(event.target).hasClass('backgroundMedia')) {
            loadBGImage($(event.target));
        }
    })

    //On Resize Ends..
    var rtime;
    var timeout = false;
    var delta = 200;
    $(window).resize(function() {
        rtime = new Date();
        if (timeout === false) {
            timeout = true;
            setTimeout(resizeend, delta);
        }
    });

    function eventLoadBGImage() {
        $.each($('.backgroundMedia:not(.hero-bg)'), function() {
            //Run Only on already loaded img
            if ($(this).hasClass('lazyloaded')) {
                loadBGImage($(this));
            }
        })
    }

    eventLoadBGImage();

    function resizeend() {
        if (new Date() - rtime < delta) {
            setTimeout(resizeend, delta);
        } else {
            timeout = false;
            //Done resizing
            eventLoadBGImage();
        }
    }

    function loadBGImage(target) {
        if ((!target.parent().hasClass('hero-bg')) && (!target.hasClass('hero-bg'))) {
            var imgID = target.attr('data-img-id');
            var w = target.width();
            var h = target.height();
            // ==== Ratio Calc ====
            var bestcrop = closest(w / h, WOODY_CROPS_VALS);
            var ratio;
            for (let i = 0; i < WOODY_CROPS_RATIOS.length; i++) {
                const iRatio = WOODY_CROPS_RATIOS[i];
                const r = iRatio.x / iRatio.y;
                if (r == bestcrop) {
                    ratio = iRatio;
                }
            }
            // ===== Size Calc =====
            var size = getSize(w);
            var crop = 'ratio_' + ratio.x + '_' + ratio.y + size;

            // ==== Opacity from class ? ====
            var opacity = 1;
            if (target.parent().is('[class*="bgimg-op"]')) {
                target.parent('[class*="bgimg-op"]').removeClass(function() {
                    var className = this.className.match(/bgimg-op\d+/);
                    var opVal = className[0].match(/\d+/);
                    opacity = opVal[0] / 100;
                })
            }
            getImageCropUrl(imgID, crop, function(urlimg) {
                if (urlimg != false) {
                    target.css('background-image', 'url("' + urlimg + '")')
                        .css('opacity', opacity);
                }
            })
        }
    }

    function getImageCropUrl(id, crop, callback) {
        var url = '/wp-json/woody/crop-url/' + id + '/' + crop;
        fetch(url).then((response) => response.json()).then((data) => {
            callback(data);
        }).catch((err) => {
            console.warn('Error : ', err);
            callback(err);
        });
    }
}
woodyBackgroundImagesCalcRatio();
