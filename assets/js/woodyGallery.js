import * as moduleWoodyGallery from './modules/woodyGallery/wgGallery.js';

// Prevent error of duplicate card in gallery with adding class on .mediaCard if parent has class .swiper-slide-duplicate
if (document.querySelectorAll('.mediaCard').length) {
    let galleryItems = document.querySelectorAll('.mediaCard:not([lightbox="0"])')

    galleryItems.forEach(function(e) {
        if (e.parentNode.classList.contains('swiper-slide-duplicate')) {
            e.classList.add('mediaCard-duplicate')
        }
    });
}

// Create woodyGallery onclick image / video / oEmbed
document.querySelectorAll(".mediaCard:not([lightbox='0']):not(.mediaCard-duplicate)").forEach((content, index) => {
    content.addEventListener('click', (e) => {
        moduleWoodyGallery.woodyGallery(
            '.mediaCard:not([lightbox="0"]):not(.mediaCard-duplicate)',
            [
                'wgZoom',
                'wgDownload',
                'wgFullScreen',
                'wgAutoplay',
                'wgPagination',
                'wgThumbnails',
                'wgHideThumbnails',
                'wgFlip',
                // 'wgRotate'
            ],
            index,
            e.target.parentNode.parentNode.dataset.wgtype,
        );
    });
});
