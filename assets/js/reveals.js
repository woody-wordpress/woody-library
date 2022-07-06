import $ from 'jquery';

$('.woody-component-esSearch-block .esSearch-button').click(function() {
    if ($('.esSearch-block-reveal').length) {
        $('.esSearch-block-reveal').foundation('open');
    }
})

$('.woody-lang_switcher-reveal .lang_switcher-button').click(function() {
    if ($('.lang_switcher-reveal').length) {
        $('.lang_switcher-reveal').foundation('open');
    }
})

$('.reveal .close-button').click(function() {
    $('body,html').removeClass('is-reveal-open').removeClass('is-cta-reveal-open');
})
