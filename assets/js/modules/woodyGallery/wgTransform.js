export function applyTransform(wgTop, object, value, mediasLength) {

    let slides = '';

    switch (wgTop.activeIndex - 1) {
        case 0:
        case mediasLength:
            slides = document.querySelectorAll(`.wg-swiper-top .swiper-slide[data-swiper-slide-index="0"]`);
            slides.forEach((slide) => {
                transformSlide(slide, object, value);
            });
            break;

        case mediasLength - 1:
        case -1:
            slides = document.querySelectorAll(`.wg-swiper-top .swiper-slide[data-swiper-slide-index="${mediasLength - 1}"]`);
            slides.forEach((slide) => {
                transformSlide(slide, object, value);
            });
            break;

        default:
            slides = document.querySelector(`.wg-swiper-top .swiper-slide[data-swiper-slide-index="${wgTop.activeIndex - 1}"]:not(.swiper-slide-duplicate)`);
            transformSlide(slides, object, value);
            break;
    }

    function transformSlide(slide, object, value) {
        if (slide) {
            slide.setAttribute(`data-${object}`,
                parseInt(slide.getAttribute(`data-${object}`)) + value
            );

            slide.setAttribute('style',
                `${slide.dataset.origincss}
        transform : rotate(${slide.dataset.wgrotate}deg)
        scale(${slide.dataset.wgflipwidth},${slide.dataset.wgflipheight});`
            );
        }
    }
}
