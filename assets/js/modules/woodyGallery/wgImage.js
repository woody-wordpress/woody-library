export function wgImage(media, copyright, wrapper) {
    if (media.getAttribute('data-wgsrc')) {
        wrapper.innerHTML += `<div class="swiper-slide wg-swiper-slide" style="background-image:url(${media.getAttribute('data-wgsrc')});" data-wgtype='img' data-wgsrc='${media.getAttribute('data-wgsrc')}'>${copyright}</div>`;
    }
}
