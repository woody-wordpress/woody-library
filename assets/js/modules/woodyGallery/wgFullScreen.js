export function wgFullScreen(wgTools) {
    // Add Fullscreen icon in toolbar
    let fullscreenTool = document.createElement('span');
    fullscreenTool.classList.add('fullscreenTool');
    fullscreenTool.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.19 18.41"><path d="M10.07,8.11,5,3,9.13,3h0a.47.47,0,0,0,0-.93l-5.35,0a.44.44,0,0,0-.33.13.48.48,0,0,0-.14.34l0,5.3a.48.48,0,0,0,.47.47h0a.48.48,0,0,0,.47-.47l0-4.2L9.4,8.78a.48.48,0,0,0,.66,0,.47.47,0,0,0,0-.67Z" transform="translate(-3.17 -2.07)" style="fill:#fff"/><path d="M9.93,13.76a.46.46,0,0,0-.67,0L4.12,18.91l0-4.25a.46.46,0,0,0-.46-.47h0a.47.47,0,0,0-.47.46l0,5.35a.45.45,0,0,0,.14.33.47.47,0,0,0,.33.14h0l5.31,0a.47.47,0,0,0,0-.94h0l-4.11,0,5.1-5.1a.48.48,0,0,0,0-.67Z" transform="translate(-3.17 -2.07)" style="fill:#fff"/><path d="M20.8,8.53h0a.47.47,0,0,0,.47-.47l.05-5.35a.45.45,0,0,0-.14-.33.48.48,0,0,0-.34-.14l-5.3,0a.48.48,0,0,0-.47.48.47.47,0,0,0,.47.46h0l4.29,0L14.6,8.42a.48.48,0,0,0,0,.67.46.46,0,0,0,.66,0L20.37,4l0,4.06a.48.48,0,0,0,.47.48Z" transform="translate(-3.17 -2.07)" style="fill:#fff"/><path d="M15.54,19.45a.46.46,0,0,0-.47.46.47.47,0,0,0,.47.47l5.11,0a.45.45,0,0,0,.19,0,.47.47,0,0,0,.33-.14l.06,0a.47.47,0,0,0,.13-.34l0-5.3a.47.47,0,0,0-.47-.47h0a.48.48,0,0,0-.47.47l0,4.25-5.16-5.14a.47.47,0,0,0-.66.66l5,5.06-4.11,0Z" transform="translate(-3.17 -2.07)" style="fill:#fff"/></svg>`;
    wgTools.appendChild(fullscreenTool);

    // Handle event click
    fullscreenTool.addEventListener('click', () => {
      wgTools.classList.toggle('fullsrceen-on');
      if (wgTools.classList.contains('fullsrceen-on')) {
        document.documentElement.requestFullscreen();
        fullscreenTool.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.19 18.41"><path d="M3.46,2.87,8.56,8l-4.17,0h0a.47.47,0,0,0,0,.94l5.35,0a.47.47,0,0,0,.34-.13.48.48,0,0,0,.14-.34l-.05-5.31a.47.47,0,0,0-.47-.46h0a.47.47,0,0,0-.46.47l0,4.2L4.12,2.2a.48.48,0,0,0-.66,0,.47.47,0,0,0,0,.67Z" transform="translate(-3.17 -2.07)" style="fill:#fff"/><path d="M3.31,20.33a.46.46,0,0,0,.67,0l5.14-5.15,0,4.25a.47.47,0,0,0,.46.47h0a.46.46,0,0,0,.47-.46l0-5.35a.45.45,0,0,0-.14-.33.47.47,0,0,0-.33-.14h0l-5.31,0a.47.47,0,0,0,0,.94h0l4.11,0-5.1,5.1a.48.48,0,0,0,0,.67Z" transform="translate(-3.17 -2.07)" style="fill:#fff"/><path d="M15,2.94h0a.47.47,0,0,0-.47.46l0,5.35a.48.48,0,0,0,.14.34.47.47,0,0,0,.33.14l5.31-.05a.47.47,0,1,0,0-.93h0l-4.29,0L21.18,3a.47.47,0,1,0-.66-.66l-5.11,5.1,0-4.07A.48.48,0,0,0,15,2.94Z" transform="translate(-3.17 -2.07)" style="fill:#fff"/><path d="M20.28,14.64a.47.47,0,0,0,.47-.46.48.48,0,0,0-.47-.48l-5.1,0a.48.48,0,0,0-.2,0,.47.47,0,0,0-.33.14.1.1,0,0,0-.05,0,.47.47,0,0,0-.14.33l0,5.31a.47.47,0,0,0,.47.46h0a.47.47,0,0,0,.47-.47l0-4.25,5.16,5.15a.47.47,0,0,0,.66,0,.47.47,0,0,0,0-.67l-5-5.05,4.11,0Z" transform="translate(-3.17 -2.07)" style="fill:#fff"/></svg>`;
      }
      else {
        if(document.fullscreenElement){
          document.exitFullscreen();
        }
        fullscreenTool.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.19 18.41"><path d="M10.07,8.11,5,3,9.13,3h0a.47.47,0,0,0,0-.93l-5.35,0a.44.44,0,0,0-.33.13.48.48,0,0,0-.14.34l0,5.3a.48.48,0,0,0,.47.47h0a.48.48,0,0,0,.47-.47l0-4.2L9.4,8.78a.48.48,0,0,0,.66,0,.47.47,0,0,0,0-.67Z" transform="translate(-3.17 -2.07)" style="fill:#fff"/><path d="M9.93,13.76a.46.46,0,0,0-.67,0L4.12,18.91l0-4.25a.46.46,0,0,0-.46-.47h0a.47.47,0,0,0-.47.46l0,5.35a.45.45,0,0,0,.14.33.47.47,0,0,0,.33.14h0l5.31,0a.47.47,0,0,0,0-.94h0l-4.11,0,5.1-5.1a.48.48,0,0,0,0-.67Z" transform="translate(-3.17 -2.07)" style="fill:#fff"/><path d="M20.8,8.53h0a.47.47,0,0,0,.47-.47l.05-5.35a.45.45,0,0,0-.14-.33.48.48,0,0,0-.34-.14l-5.3,0a.48.48,0,0,0-.47.48.47.47,0,0,0,.47.46h0l4.29,0L14.6,8.42a.48.48,0,0,0,0,.67.46.46,0,0,0,.66,0L20.37,4l0,4.06a.48.48,0,0,0,.47.48Z" transform="translate(-3.17 -2.07)" style="fill:#fff"/><path d="M15.54,19.45a.46.46,0,0,0-.47.46.47.47,0,0,0,.47.47l5.11,0a.45.45,0,0,0,.19,0,.47.47,0,0,0,.33-.14l.06,0a.47.47,0,0,0,.13-.34l0-5.3a.47.47,0,0,0-.47-.47h0a.48.48,0,0,0-.47.47l0,4.25-5.16-5.14a.47.47,0,0,0-.66.66l5,5.06-4.11,0Z" transform="translate(-3.17 -2.07)" style="fill:#fff"/></svg>`;
      }
    });

    // TODO: Gérer le cas ou la personne fait "echap" en full screen pour changer l'icone
    // TODO: Gérer le cas ou la personne fait la croix windows en full screen pour changer l'icone
}