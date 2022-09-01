import $ from 'jquery';

var WOODY_CROPS_RATIOS = [
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
    WOODY_CROPS_VALS.push(WOODY_CROPS_RATIOS[i].x / WOODY_CROPS_RATIOS[i].y);
}

$('.bgImageObject').each(function () {
    var $this = $(this);
    var w = $this.width();
    var h = $this.height();
    var size = getSize(w);
    var ratio = getRatio(w, h);
    var ratios = {};
    if(ratio.x == 1 && ratio.y == 1){
        var crop = 'ratio_square' + size;
    } else {
        var crop = 'ratio_' + ratio.x + '_' + ratio.y + size;
    }

    var opacity = 'opacity:1;';
    if ($this.parent().is('[class*="bgimg-op"]')) {
        opacity = '';
    }

    if ($this.hasClass('lazyloaded')) {
        loadImages();
    } else {
        $this.on("lazybeforeunveil", function () {
            loadImages()
        });
    }

    function loadImages() {
        $.ajax({
            method: 'GET',
            url: '/wp-json/woody/crop-url/' + $this.data('img-id'),
            dataType: 'json',
            success: function (response) {
                ratios = response;
                $this.attr('style', 'background-image:url("' + ratios[crop] + '");' + opacity);
            },
            error: function (error) {
                console.error('Unable to load images ratio. An error has occured : ' + error);
            }
        });
    }
});

function closest(num, arr) {
    let curr = arr[0];
    let diff = Math.abs(num - curr);
    for (let val = 0; val < arr.length; val++) {
        let newdiff = Math.abs(num - arr[val]);
        if (newdiff < diff) {
            diff = newdiff;
            curr = arr[val];
        }
    }
    return curr;
}

function getSize(w) {
    if (w < 440) {
        return '_small';
    } else if (w < 768) {
        return '_medium';
    }
    return '';
}

function getRatio(w, h) {
    let bestcrop = closest(w / h, WOODY_CROPS_VALS);
    let ratio;
    for (let i = 0; i < WOODY_CROPS_RATIOS.length; i++) {
        let iRatio = WOODY_CROPS_RATIOS[i];
        let r = iRatio.x / iRatio.y;
        if (r == bestcrop) {
            ratio = iRatio;
        }
    }
    return ratio;
}
