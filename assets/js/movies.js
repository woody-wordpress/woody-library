import $ from 'jquery';

$('.toggling-movie-container').each(function() {
    var $this = $(this);

    $this.find('.toggling-movie').each(function() {
        var tooglingMovie = $(this);
        tooglingMovie.find('iframe').each(function() {
            var embedFrame = $(this);
            var embed_src = embedFrame.attr('src').replace('autoplay=0', 'autoplay=1');
            embedFrame.attr('src', '');

            $this.find('.movie-toggle').click(function() {
                tooglingMovie.toggleClass('hidden');
                if ($(this).hasClass('close-button')) {
                    embedFrame.attr('src', '');
                } else {
                    embedFrame.attr('src', embed_src);
                }
                $(this).toggleClass('close-button');
            });
        });
    });
});

$('.woody-component-hero.tpl_04').each(function () {
    $(this).find('iframe').each(function () {
        var embedFrame = $(this);
        var embed_src = embedFrame.attr('src').replace('autoplay=0', 'autoplay=1');
        embedFrame.css('height', '100%');
        embedFrame.attr('src', embed_src);

    })
});
