import $ from 'jquery';



$('.woody-component-esSearch-block .esSearch-button').click(function() {
    if ($('.esSearch-block-reveal').length) {
        $('.esSearch-block-reveal').foundation('open');
    }
})

$('.woody-lang_switcher .lang_switcher-button').click(function() {
    if ($('.lang_switcher-reveal').length) {
        $('.lang_switcher-reveal').foundation('open');
    }
})

$('.esSearch-block-reveal .close-button').click(function() {
    $('.esSearch-block-reveal').foundation('_destroy');
    $('body').removeClass('is-reveal-open');
})
