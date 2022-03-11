import $ from 'jquery';

if (window.innerWidth >= 1024) {
    function setSlideshowImages(srcs, $wrapper) {
        $wrapper.append('<div class="card-slideshow-wrapper"></div>');
        for (var i = 0; i < srcs.length; i++) {
            $wrapper.find('.card-slideshow-wrapper').append('<img class="img-responsive card-slideshow-img imgL' + srcs.length + '" src="' + srcs[i] + '"/>');
        }
    }

    $('.woody-component-focus .card.has-slideshow').each(function() {
        var $this = $(this);
        var $imgWrapper = $this.find('.imageObject');
        var $img = $this.find('.imageObject-img');
        var imgWidth = $img.width();
        var ratio = $this.find('.slideshow-srcs').data('ratio');
        var srcs = JSON.parse(atob($this.find('.slideshow-srcs').data('srcs'), true));
        var final_srcs = [];
        var cardSlideshowActive = false;


        $.each(srcs, function(index, value) {
            if (imgWidth < 400) {
                final_srcs.push(srcs[index][ratio + '_small']);
            } else if (imgWidth < 700) {
                final_srcs.push(srcs[index][ratio + '_medium']);
            } else {
                final_srcs.push(srcs[index][ratio]);
            }
        });

        if (cardSlideshowActive == false) {
            cardSlideshowActive = true;
            setSlideshowImages(final_srcs, $imgWrapper);
        }

        // $this.on('mouseover', function() {
        //     if (cardSlideshowActive == false) {
        //         cardSlideshowActive = true;
        //         setSlideshowImages(final_srcs, $imgWrapper);
        //     }
        // });
    });
}

if (window.innerWidth <= 768) {
    $('.woody-component-focus.tpl_201, .woody-component-focus.tpl_404, .woody-component-focus.tpl_502, .woody-component-focus.tpl_503, .woody-component-focus.tpl_602, .woody-component-focus.tpl_605').each(function() {
        if ($(this).find('.swResp').length == 0) {
            $(this).find('.swiper-controls').remove();
        }
    });

    $('.card[data-sheetid]').click(function() {
        if ($(this).find('.card-link')) {
            $(this).find('.card-link').attr('target', '_self');
        }
    });
}
