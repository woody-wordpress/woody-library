import * as transformMethod from './wgTransform.js';

export function wgFlip(wgTools, wgTop, mediasLength) {
    // Add FlipUp icon in toolbar
    let flipUpDownTool = document.createElement('span');
    flipUpDownTool.classList.add('flipUpDownTool');
    flipUpDownTool.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12.36 18.41"><path d="M8.4,4.62h0A.47.47,0,0,0,8.4,4L4.65.14A.47.47,0,0,0,4.32,0,.48.48,0,0,0,4,.14L.23,3.89a.47.47,0,0,0,0,.67.46.46,0,0,0,.65,0h0l3-3V8.93a.47.47,0,0,0,.94,0V1.72L7.76,4.59a.47.47,0,0,0,.67,0Z" transform="translate(-0.1 0)" style="fill:#fff"/><path d="M4.77,13.83a.46.46,0,0,0-.65,0h0a.48.48,0,0,0,0,.67L7.73,18.1a.4.4,0,0,0,.13.13.47.47,0,0,0,.33.14l0,0a.49.49,0,0,0,.34-.15l3.74-3.75a.45.45,0,0,0,0-.66h0a.47.47,0,0,0-.66,0l-3,3V9.57a.47.47,0,0,0-.93,0l0,7.11-2.9-2.9Z" transform="translate(-0.1 0)" style="fill:#fff"/></svg>`;
    wgTools.appendChild(flipUpDownTool);

    // Add FlipLeft icon in toolbar
    let flipLeftRightTool = document.createElement('span');
    flipLeftRightTool.classList.add('flipLeftRightTool');
    flipLeftRightTool.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.41 12.36"><path d="M4.93,7.08h0a.47.47,0,0,0-.66,0L.45,10.83a.42.42,0,0,0-.13.33.48.48,0,0,0,.14.34L4.2,15.25a.49.49,0,0,0,.68,0,.47.47,0,0,0,0-.65h0l-3-3h7.4a.48.48,0,0,0,.47-.48.45.45,0,0,0-.45-.46h0L2,10.59,4.9,7.72a.47.47,0,0,0,0-.67Z" transform="translate(-0.32 -3.03)" style="fill:#fff"/><path d="M14.14,10.71a.46.46,0,0,0,0,.65h0a.48.48,0,0,0,.67,0l3.61-3.61a.62.62,0,0,0,.14-.14.51.51,0,0,0,.13-.33l0,0a.45.45,0,0,0-.15-.34L14.83,3.17a.47.47,0,0,0-.67,0h0a.47.47,0,0,0,0,.66l3,3H9.88a.47.47,0,0,0,0,.93l7.12,0-2.91,2.9Z" transform="translate(-0.32 -3.03)" style="fill:#fff"/></svg>`;
    wgTools.appendChild(flipLeftRightTool);

    // Handle event click
    let currentSlides = '';
    let currentSlide = '';
    flipUpDownTool.addEventListener('click', () => {
        currentSlides = document.querySelectorAll(`.wg-swiper-top .swiper-slide[data-swiper-slide-index="${wgTop.activeIndex - 1}"]`);
        currentSlides.forEach((slide) => {
            currentSlide = slide;
            currentSlide.classList.toggle('wgflipheight');
        });

        if (currentSlide.classList.contains('wgflipheight')) {
            transformMethod.applyTransform(wgTop, 'wgflipheight', -2, mediasLength);
        }
        else {
            transformMethod.applyTransform(wgTop, 'wgflipheight', 2, mediasLength);
        }
    });

    flipLeftRightTool.addEventListener('click', () => {
        currentSlides = document.querySelectorAll(`.wg-swiper-top .swiper-slide[data-swiper-slide-index="${wgTop.activeIndex - 1}"]`);
        currentSlides.forEach((slide) => {
            currentSlide = slide;
            currentSlide.classList.toggle('wgflipwidth');
        });

        if (currentSlide.classList.contains('wgflipwidth')) {
            transformMethod.applyTransform(wgTop, 'wgflipwidth', -2, mediasLength);
        }
        else {
            transformMethod.applyTransform(wgTop, 'wgflipwidth', 2, mediasLength);
        }
    });
}
