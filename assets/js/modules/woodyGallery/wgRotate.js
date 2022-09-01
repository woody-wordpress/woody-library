import * as transformMethod from './wgTransform.js';

export function wgRotate(wgTools, wgTop, mediasLength) {
    // Add RotateLeft icon in toolbar
    let RotateLeft = document.createElement('span');
    RotateLeft.classList.add('RotateLeft');
    RotateLeft.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.07 18.06"><path style="fill:#FFF" d="M3.84,5.63l.75.64A6.5,6.5,0,0,1,6.06,5V3.91A7.62,7.62,0,0,0,3.84,5.63Zm-1,1.51A7.18,7.18,0,0,0,2,9.73H3a6.63,6.63,0,0,1,.59-1.94Zm6.7-4.07A7.29,7.29,0,0,0,8,3.22v1a6.11,6.11,0,0,1,1.48-.17,6.59,6.59,0,1,1,0,13.18A6.53,6.53,0,0,1,4.68,15.1L4,15.79A7.56,7.56,0,1,0,9.51,3.07ZM2,11.55a7.3,7.3,0,0,0,.91,2.77l.71-.72a6.46,6.46,0,0,1-.64-2Z" style=" transform=translate(-2.01 -0.14); fill:#FFF"/><line x1="8.75" y1="6.46" x2="5.78" y2="3.49" style="fill:none;stroke:#FFF;stroke-linecap:round;stroke-miterlimit:10"/><line x1="8.75" y1="0.5" x2="5.78" y2="3.48" style="fill:none;stroke:#FFF;stroke-linecap:round;stroke-miterlimit:10"/></svg>`;
    wgTools.appendChild(RotateLeft);

    // Add RotateRight icon in toolbar
    let RotateRight = document.createElement('span');
    RotateRight.classList.add('RotateRight');
    RotateRight.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.07 18.06"><path d="M15.25,5.63l-.75.64A6.5,6.5,0,0,0,13,5V3.91A7.62,7.62,0,0,1,15.25,5.63Zm1,1.51a7.18,7.18,0,0,1,.8,2.59h-1a6.63,6.63,0,0,0-.59-1.94ZM9.58,3.07a7.29,7.29,0,0,1,1.48.15v1a6.11,6.11,0,0,0-1.48-.17,6.59,6.59,0,1,0,0,13.18,6.53,6.53,0,0,0,4.83-2.13l.69.69A7.56,7.56,0,1,1,9.58,3.07Zm7.5,8.48a7.3,7.3,0,0,1-.91,2.77l-.71-.72a6.46,6.46,0,0,0,.64-2Z"  style=" transform=translate(-2.01 -0.14); fill:#FFF"/><line x1="6.32" y1="6.46" x2="9.29" y2="3.49" style="fill:none;stroke:#FFF;stroke-linecap:round;stroke-miterlimit:10"/><line x1="6.32" y1="0.5" x2="9.29" y2="3.48" style="fill:none;stroke:#FFF;stroke-linecap:round;stroke-miterlimit:10"/></svg>`;
    wgTools.appendChild(RotateRight);

    // Handle event click
    RotateLeft.addEventListener('click', () => {
        transformMethod.applyTransform(wgTop, 'wgrotate', -90, mediasLength);
    });

    RotateRight.addEventListener('click', () => {
        transformMethod.applyTransform(wgTop, 'wgrotate', 90, mediasLength);
    });
}
