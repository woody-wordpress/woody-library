export function wgPagination(wgTools, wgTop, slideStartIndex, slidesLenght){
  let wgPagination = document.createElement('p');
  wgPagination.classList.add('wgPagination');
  wgPagination.innerHTML = `${slideStartIndex +1} / ${slidesLenght}`;
  wgTools.appendChild(wgPagination);

  wgTop.on('activeIndexChange', function () {
    switch (wgTop.activeIndex) {
      case 0 : wgPagination.innerHTML = `${slidesLenght} / ${slidesLenght}`; break;
      case slidesLenght+1 : wgPagination.innerHTML = `1 / ${slidesLenght}`; break;
      default : wgPagination.innerHTML = `${wgTop.activeIndex} / ${slidesLenght}`; break;
    }
  });
}