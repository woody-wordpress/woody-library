import $ from 'jquery';
// import * as lightGallery from 'lightGallery';
// import * as thumbnail from 'lg-thumbnail';

if ($(".mediaCard").length) {
    var galleryItems = $('.mediaCard:not([lightbox=0])');

    // Add class on .mediaCard if parent has class .swiper-slide-duplicate
    galleryItems.each(function() {
        if ($(this).parent().hasClass("swiper-slide-duplicate")) {
            $(this).addClass('mediaCard-duplicate');
        }
    });
}
if ($('.mediaCard:not([lightbox=0]):not(.mediaCard-duplicate)').length) {
    $(".content-wrapper").lightGallery({
        mode: 'lg-fade',
        selector: '.mediaCard:not([lightbox=0]):not(.mediaCard-duplicate)',
        cssEasing: 'cubic-bezier(0.25, 0, 0.25, 1)',
        thumbWidth: 120,
        thumbHeight: '90px',
        exThumbImage: 'data-lgthumb'
    });
}


// Prevent the download image option, you can simply prevent right click option on images .
$('body').on('contextmenu', 'img, .imageObject-img, .lg-image', function(e) {
    e.preventDefault();
});

// Prevent drag-drop image to open on new tab
$('img').on('dragstart', function(e) {
    e.preventDefault();
});
