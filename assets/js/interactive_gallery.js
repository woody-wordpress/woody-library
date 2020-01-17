import $ from 'jquery';

$('.woody-component-interactive_gallery .swiper-slide').each(function() {
    var $this=$(this).find('.tooltip');
    $this.on("click", function(e) {
        $this.toggleClass('is-open');
    });
});

