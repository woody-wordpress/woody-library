import $ from 'jquery';

$('.woody-component-interactive_gallery').each(function() {

    var $this=$('.tooltip');
    $this.on("click", function(e) {
        $this.toggleClass('is-open');
    });


});

