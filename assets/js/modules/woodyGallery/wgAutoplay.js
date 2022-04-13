export function wgAutoplay(wgTools, wgTop, wG){
  // Add Play icon in toolbar
  let autoplayBar = document.createElement('span');
  let autoTool = document.createElement('span');
  autoTool.classList.add('autoTool');
  autoTool.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.26 18.26"><path d="M9.51,1.08A8.13,8.13,0,1,1,1.38,9.2,8.13,8.13,0,0,1,9.51,1.08m0-1A9.13,9.13,0,1,0,18.64,9.2,9.12,9.12,0,0,0,9.51.08Z" transform="translate(-0.38 -0.08)" style="fill:#fff"/><path d="M8.4,7.5l1.47.85,1.48.85-1.48.86-1.47.85V7.5m-1-1.73v6.87l3-1.72,3-1.72-3-1.71-3-1.72Z" transform="translate(-0.38 -0.08)" style="fill:#fff"/></svg>`;
  wgTools.appendChild(autoTool);

  // Handle event click
  autoTool.addEventListener('click', () => {
    wgTools.classList.toggle('autoplay-on');
    if (wgTools.classList.contains('autoplay-on')) {
      autoTool.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.26 18.26"><path d="M9.51,1.08A8.13,8.13,0,1,1,1.38,9.2,8.13,8.13,0,0,1,9.51,1.08m0-1A9.13,9.13,0,1,0,18.64,9.2,9.12,9.12,0,0,0,9.51.08Z" transform="translate(-0.38 -0.08)" style="fill:#fff"/><line x1="7.24" y1="6.39" x2="7.24" y2="11.86" style="fill:none;stroke:#fff;stroke-miterlimit:10"/><line x1="11.01" y1="6.39" x2="11.01" y2="11.86" style="fill:none;stroke:#fff;stroke-miterlimit:10"/></svg>`;
      wgTop.autoplay.start();

      autoplayBar.classList.add('autoplayBar');
      wG.insertBefore(autoplayBar, wgTools);

    }
    else {
      autoTool.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.26 18.26"><path d="M9.51,1.08A8.13,8.13,0,1,1,1.38,9.2,8.13,8.13,0,0,1,9.51,1.08m0-1A9.13,9.13,0,1,0,18.64,9.2,9.12,9.12,0,0,0,9.51.08Z" transform="translate(-0.38 -0.08)" style="fill:#fff"/><path d="M8.4,7.5l1.47.85,1.48.85-1.48.86-1.47.85V7.5m-1-1.73v6.87l3-1.72,3-1.72-3-1.71-3-1.72Z" transform="translate(-0.38 -0.08)" style="fill:#fff"/></svg>`;
      wgTop.autoplay.stop();
      autoplayBar.remove();
    }
});
};