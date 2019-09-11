if ($(window).width() > 1024) {

    // Parallax for heroes
    var has_parallax = $('.parallax-hero').find('.rellax').length;
    if (has_parallax != 0) {
        var rellax = new Rellax('.rellax');
    };

    // Parallax for sections
    var sectionsRellax = [];
    $('.page-section').each(function() {
        var $this = $(this),
            sectionIndexClass = $this.attr('class').split(' ')[1],
            sectionRellax = $this.find('.section-rellax');

        if (sectionRellax.length != 0) {
            var trigger = $this.find('.section-rellax').attr('class').split(' ')[1];
            sectionsRellax.push(
                new Rellax('.' + trigger, {
                    wrapper: '.' + sectionIndexClass,
                    relativeToWrapper: true
                })
            );
        }
    });

    $('.hero-blur').each(function() {
        var $this = $(this),
            $media = $this.find('.hero-bg');

        $(window).scroll(function() {
            var scroll = $(window).scrollTop();
            $media.css({
                top: -(scroll / 10) + "%",
                "-webkit-filter": "blur(" + (scroll / 150) + "px)",
                filter: "blur(" + (scroll / 150) + "px)"
            });

        });
    });
}
