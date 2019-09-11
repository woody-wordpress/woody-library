import $ from 'jquery';

$(document).on("open.zf.reveal", function(e) {
    var $doc = $(this);
    if ($(e.target).hasClass('media-reveal')) {
        var $this = $(e.target),
            $prevEl = $($this.parent().prev().children('.media-reveal')),
            $nextEl = $($this.parent().next().children('.media-reveal')),
            nextButton = $this.find('.media-reveal-nav .next-button'),
            prevButton = $this.find('.media-reveal-nav .prev-button');

        if ($prevEl.length == 0) {
            $this.find('.prev-button').addClass('disable');
        }

        if ($nextEl.length == 0) {
            $this.find('.next-button').addClass('disable');
        }

        nextButton.click(function() {
            $nextEl.foundation('open');
        });
        prevButton.click(function() {
            $prevEl.foundation('open');
        });
    };
});
