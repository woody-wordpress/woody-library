import $ from 'jquery';

$('.woody-component-custom-text').each(function() {
    $(this).find('table').each(function() {
        $(this).addClass('hover').wrap('<div class="table-scroll"></div>');
    });
});
