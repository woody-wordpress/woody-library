export function wgHideThumbnails(wgThumbnails) {
    // Create tool icon
    let hideThumbnails = document.createElement('span');
    hideThumbnails.classList.add('hideThumbnailsTool');
    wgThumbnails.$el[0].appendChild(hideThumbnails);

    // Handle event click
    hideThumbnails.addEventListener('click', () => {
        wgThumbnails.$el[0].classList.toggle('hideThumbs-on');
    });
}
