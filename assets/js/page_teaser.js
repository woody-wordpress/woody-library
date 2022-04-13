const mapPageTeaser = document.querySelector('.woody-component-teaser .geo-map-corner');
const extendMapIcon = document.querySelector('.woody-component-teaser .geo-map-corner .extend-map-icon');
const showGeomapMobileButton = document.querySelectorAll('.show-geomap-mobile-button,.hide-geomap-mobile-button');

if (mapPageTeaser != null && extendMapIcon != null && showGeomapMobileButton != null) {

    // On agrandit la carte géographique au clic sur l'icône "Agrandir" en desktop
    extendMapIcon.addEventListener('click', function () {
        mapPageTeaser.querySelector('.leaflet-container').classList.toggle('zoomed');
        mapPageTeaser.classList.toggle('full');
        extendMapIcon.classList.toggle('translated');
    });

    // On affiche la carte géographique au clic sur le bouton "Afficher la carte" en mobile
    showGeomapMobileButton.forEach(element => {
        element.addEventListener('click', function () {
            mapPageTeaser.querySelector('.leaflet-container').classList.toggle('zoomed');
            mapPageTeaser.classList.toggle('full');
        });
    } );
}
