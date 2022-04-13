import WoodyFilter from '../../filter';
import * as pluginwgTools from './wgTools.js';
import * as pluginwgZoom from './wgZoom.js';
import * as pluginwgFullScreen from './wgFullScreen.js';
import * as pluginwgAutoplay from './wgAutoplay.js';
import * as pluginwgFlip from './wgFlip.js';
import * as pluginwgDownload from './wgDownload.js';
import * as pluginwgRotate from './wgRotate.js';
import * as pluginwgContent from './wgContent.js';
import * as pluginwgSwiper from './wgSwiper.js';
import * as pluginwgThumbnails from './wgThumbnails.js';
import * as pluginwgHideThumbnails from './wgHideThumbnails.js';
import * as pluginwgPagination from './wgPagination.js';

// Filtre pour activer le téléchargement des images
let enableWgDownload = WoodyFilter.apply('enable_wg_download');
enableWgDownload = typeof enableWgDownload === 'undefined' ? false : enableWgDownload;

let wG = '';

export function woodyGallery(selector, plugins = ['wgPagination', 'wgThumbnails'], slideStartIndex, target) {
    // Create woodyGallery
    wG = document.createElement('aside');
    wG.classList.add('wgGallery');
    document.querySelector('body').appendChild(wG);
    document.querySelector('body').setAttribute('style', 'width:100%;height:100vh; overflow:hidden');

    // Create wgTools
    pluginwgTools.wgTools(wG);
    // Add tools Zoom, Fullscreen, Autoplay
    plugins.forEach((plugin) => {
        switch (plugin) {
            case 'wgZoom':
                pluginwgZoom.wgZoom(pluginwgTools.wgTool);
                break;
            case 'wgFullScreen':
                pluginwgFullScreen.wgFullScreen(pluginwgTools.wgTool);
                break;
        }
    });

    // Create wgContent
    const medias = document.querySelectorAll(selector);
    pluginwgContent.wgContent(medias, wG);

    // Create wgThumbnails
    plugins.forEach((plugin) => {
        switch (plugin) {
            case 'wgThumbnails':
                pluginwgThumbnails.wgThumbnails(slideStartIndex, medias);
                break;
            case 'wgHideThumbnails':
                pluginwgHideThumbnails.wgHideThumbnails(pluginwgThumbnails.wgThumbnail);
                break;
        }
    });

    // Create Swiper
    pluginwgSwiper.wgSwiper(slideStartIndex, pluginwgThumbnails.wgThumbnail, pluginwgTools.wgTool, medias.length, target);

    // Add Pagination & tools Flip, Rotate
    plugins.forEach((plugin) => {
        switch (plugin) {
            case 'wgDownload':
                if (enableWgDownload == true) {
                    // Si le téléchargement des images est actif
                    pluginwgDownload.wgDownload(pluginwgTools.wgTool, pluginwgSwiper.wgTop, medias.length);
                }
                break;
            case 'wgPagination':
                pluginwgPagination.wgPagination(pluginwgTools.wgTool, pluginwgSwiper.wgTop, slideStartIndex, medias.length);
                break;
            case 'wgFlip':
                pluginwgFlip.wgFlip(pluginwgTools.wgTool, pluginwgSwiper.wgTop, medias.length);
                break;
            case 'wgRotate':
                pluginwgRotate.wgRotate(pluginwgTools.wgTool, pluginwgSwiper.wgTop, medias.length);
                break;
            case 'wgAutoplay':
                pluginwgAutoplay.wgAutoplay(pluginwgTools.wgTool, pluginwgSwiper.wgTop, wG);
                break;
        }
    });
}
