import $ from 'jquery';

if (window.innerWidth <= 768) {
    $('.woody-component-tabs').each(function () {
        var elem=$(this).find('.tabs');
        elem.closest(".tabs-wrapper").addClass("isLeft");
        elem.scroll(function(){
            var scroll = $(this).scrollLeft(),
                scrollWidth = $(this).get(0).scrollWidth,
                parent =  $(this).closest(".tabs-wrapper"),
                width = $(this).outerWidth();
            if (scroll === 0) {
                parent.addClass("isLeft");
            } else if (scrollWidth-scroll==width) {
                parent.addClass("isRight");
            } else {
                parent.removeClass("isRight isLeft");
            }
        })
    });
}
