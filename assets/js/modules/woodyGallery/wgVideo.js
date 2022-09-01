export function wgVideo(media, wrapper) {
    if (media.getAttribute('data-wgsrc')) {
        switch (media.dataset.wgtype) {
            case 'video':
                wrapper.innerHTML += `<div class="swiper-slide wg-swiper-slide wg-slide-iframe" data-wgtype="video"><div><video src="${media.getAttribute('data-wgsrc')}" loop controls class="swiper-slide wg-swiper-slide" data-wgtype="video"><source src="${media.getAttribute('data-wgsrc')}"></video></div></div>`;
                break;

            default:
                wrapper.innerHTML += foundIframe(media.getAttribute('data-wgsrc'), foundProvider(media.getAttribute('data-wgsrc')));
                break;
        }
    }
}

function foundProvider(url) {
    let provider = '';

    if (url.includes('youtu')) {
        provider = 'youtube';
    }
    else if (url.includes('dailymotion')) {
        provider = 'dailymotion';
    }
    else if (url.includes('vimeo')) {
        provider = 'vimeo';
    }
    return provider
}

function foundIframe(url, provider) {

    let iframe = '';

    switch (provider) {
        case 'youtube':
            iframe = `<div class="swiper-slide wg-swiper-slide wg-slide-iframe" data-wgtype="video"><div><iframe class="swiper-slide wg-swiper-slide wg-slide-iframe" src="https://www.youtube.com/embed/${url.match(/(v=*)(.*)/)[2]}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="1"></iframe></div></div>`;
            break;

        case 'dailymotion':
            iframe = `<div class="swiper-slide wg-swiper-slide wg-slide-iframe" data-wgtype="video"><div><iframe frameborder="0" type="text/html" src="https://www.dailymotion.com/embed/${url.match(/(v=*)(.*)\?/)[0].substr(0, url.match(/(v=*)(.*)\?/)[0].length - 1)}" allowfullscreen allow="autoplay"></iframe></div></div>`;
            break;

        case 'vimeo':
            iframe = `<div class="swiper-slide wg-swiper-slide wg-slide-iframe" data-wgtype="video"><div><iframe src="https://player.vimeo.com/video/${url.match(/(com\/*)(.*)/)[2]}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div></div>`;
            break;
    }

    return iframe

}
