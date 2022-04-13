export let wgTool = '';

export function wgTools(woodyGallery){
  //Create Tools
  wgTool = document.createElement('section');
  let closeTool = document.createElement('span');
  closeTool.classList.add('closeTool');
  wgTool.appendChild(closeTool);
  wgTool.classList.add('wgTools');
  woodyGallery.appendChild(wgTool);

  closeTool.addEventListener('click', () => {
    woodyGallery.remove();
    if(document.fullscreenElement){
      document.exitFullscreen();
    }
    document.querySelector('body').setAttribute('style', '');
  });
}
