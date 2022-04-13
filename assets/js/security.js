import WoodyFilter from 'woody-library/assets/js/filter';

// Filtre pour desactiver la sécurité des images
let disableImgSecurity = WoodyFilter.apply('disable_img_security');
disableImgSecurity = typeof disableImgSecurity === 'undefined' ? false : disableImgSecurity;

// Si la sécurité des images n'est pas desactivée
if (disableImgSecurity != true) {
    // Prevent the download image option, you can simply prevent right click option on images .
    let datas = ['img', '.imageObject-img', '.lg-image'];
    datas.forEach(function(e) {
        if (document.querySelectorAll('body ' + e).length != 0) {
            document.querySelectorAll('body ' + e).forEach(function(f) {
                f.addEventListener('contextmenu', function(el) {
                    el.preventDefault();
                });
            });
        };
    });
}

// Prevent drag-drop image to open on new tab
document.querySelectorAll('img').forEach(function(e) {
    e.addEventListener('dragstart', function(f) {
        f.preventDefault();
    });
});
