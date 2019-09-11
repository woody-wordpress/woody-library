import $ from 'jquery';

$('.woody-season-switcher').each(function() {
    var $this = $(this);
    $('label[for=seasonSwitcher]').on('click', function() {
        var winterLink = $this.find('.is-hiver'),
            summerLink = $this.find('.is-ete');

        if (winterLink.hasClass('is-season-link')) {
            winterLink.toggleClass('is-active');
            summerLink.toggleClass('is-active');
            summerLink.toggleClass('is-disabled');
            window.location.href = winterLink[0].href;

        }

        if (summerLink.hasClass('is-season-link')) {
            summerLink.toggleClass('is-active');
            winterLink.toggleClass('is-active');
            winterLink.toggleClass('is-disabled');
            window.location.href = summerLink[0].href;
        }
    });
})
