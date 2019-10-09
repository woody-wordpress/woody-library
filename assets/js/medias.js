import $ from 'jquery';

$('.embed-plyr').each(function() {
    var $this = $(this),
        $heroPlyrWrapper = $(this).find('.heroPlyr-wrapper'),
        heroPlyr = new Plyr($heroPlyrWrapper);
    $this.find('.toggling-movie').each(function() {
        var $togglingMovie = $(this);
        $this.find('.movie-toggle').click(function() {
            $togglingMovie.toggleClass('hidden');
            if ($(this).hasClass('close-button')) {
                heroPlyr.stop();
            } else {
                heroPlyr.play();
            }
            $(this).toggleClass('close-button');
        });
    });

    if ($this.parents('.woody-component-hero.tpl_04').length) {
        heroPlyr.on('ready', event => {
            heroPlyr.play();
        });
    }

});

// Create Plyrs objects to get smart controls over medias files
// See https://github.com/sampotts/plyr#initialising for more inforations
Plyr.setup('.plyrObject');
