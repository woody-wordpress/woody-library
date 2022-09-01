import Swiper from "swiper";

export let wgTop = '';
export function wgSwiper(slideStartIndex, thumbnails, wgTool, mediasLength, target) {
    wgTop = new Swiper('.wg-swiper-top', {
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        centeredSlides: true,
        initialSlide: slideStartIndex,
        thumbs: {
            swiper: thumbnails,
        },
        keyboard: true,
        autoplay: {
            delay: 5000
        }
    });
    wgTop.autoplay.stop();

    let wrapperChildren = Array.from(document.querySelector('.wg-swiper-top .wg-swiper-wrapper').children);
    wrapperChildren.forEach((child) => {
        child.setAttribute('data-originCSS', child.getAttribute('style'));
        child.setAttribute('data-wgRotate', '0');
        child.setAttribute('data-wgFlipHeight', '1');
        child.setAttribute('data-wgFlipWidth', '1');
    });

    // Disabled tools for movie
    if (target != 'img') {
        wgTool.classList.add('video-tools');
    }

    wgTop.on('slideChange', function () {
        let slides = '';
        let slideType = '';

        switch (wgTop.activeIndex - 1) {
            case 0:
            case mediasLength:
                slides = document.querySelectorAll(`.wg-swiper-top .swiper-slide[data-swiper-slide-index="0"]`);
                slides.forEach((slide) => {
                    if (slide.dataset.wgtype) {
                        slideType = slide.dataset.wgtype;
                    }
                });
                break;

            case mediasLength - 1:
            case -1:
                slides = document.querySelectorAll(`.wg-swiper-top .swiper-slide[data-swiper-slide-index="${mediasLength - 1}"]`);
                slides.forEach((slide) => {
                    if (slide.dataset.wgtype) {
                        slideType = slide.dataset.wgtype;
                    }
                });
                break;

            default:
                slideType = document.querySelector(`.wg-swiper-top .swiper-slide[data-swiper-slide-index="${wgTop.activeIndex - 1}"]`).dataset.wgtype;
                break;
        }

        switch (slideType) {
            case 'video':
                wgTool.classList.add('video-tools');
                break;

            default:
                wgTool.classList.remove('video-tools');
                break;
        }
    });
}
