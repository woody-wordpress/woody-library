import * as pluginwgImage from './wgImage.js';
import * as pluginwgVideo from './wgVideo.js';

export function wgContent(medias, wG) {
    let wgContent = document.createElement('section');
    wgContent.classList.add('wgContent');
    wgContent.innerHTML = `<section class="wg-swiper-top swiper"><div class="wg-swiper-wrapper swiper-wrapper"></div><div class="swiper-button-next swiper-button-white"></div><div class="swiper-button-prev swiper-button-white"></div></section>`;
    wG.appendChild(wgContent);

    let wrapper = document.querySelector('.wg-swiper-top .wg-swiper-wrapper');
    medias.forEach((media) => {
        let copyright = media.querySelector('.imageObject-caption') != null ? media.querySelector('.imageObject-caption').outerHTML : '';
        if (media.dataset.wgtype === "video" || media.dataset.wgtype === "video-embed") {
            pluginwgVideo.wgVideo(media, wrapper);
        }
        else {
            pluginwgImage.wgImage(media, copyright, wrapper);
        }
    });
}

