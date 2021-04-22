import $ from 'jquery';

$('.full .close-button').on('click', function() {
    $(this).closest('.full').hide();
});

$('.win-print').click(function() {
    window.print();
});
