export let wgThumbnail = '';

export function wgThumbnails(slideStartIndex, medias){

  let content = `<section class="wg-swiper-thumbnails swiper"><div class="wg-swiper-wrapper swiper-wrapper">`;
  medias.forEach((media) => {
    if (media.getAttribute('data-wgthumb')) {
      content += `<div class="swiper-slide wg-swiper-slide" style="background-image:url(${media.getAttribute('data-wgthumb')})"></div>`;
    }
  });
  content += `</div></section>`;
  document.querySelector('.wgContent').innerHTML += content;

  wgThumbnail = new Swiper('.wg-swiper-thumbnails', {
    watchSlidesProgress: true,
    slidesPerView : 18,
    freeMode: true,
    initialSlide : slideStartIndex,

    breakpoints: {
        1440 : {slidesPerView : 10},
        800 : {slidesPerView : 5},
        500 : {slidesPerView : 3},
    }
});
};
