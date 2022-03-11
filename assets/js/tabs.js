import $ from 'jquery';

if (window.innerWidth <= 768) {
    $('.woody-component-tabs').each(function () {
        var elem=$(this).find('.tabs');
        var tabs= elem.find('.tab-link');
        elem.on('click', function(){
            if ($(this).hasClass("is-open")){
                    $(this).removeClass('is-open');
            }else{
                $(this).addClass("is-open");
            }
        });
        tabs.on('click', function(){
            elem.removeClass('is-open');
        });
    });


}


