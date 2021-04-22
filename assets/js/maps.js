import $ from 'jquery';

$('.woody-component-focus-map').each(function() {
    var $this = $(this);
    var map_id = $this.find('.map-wrapper').attr('id');

    var checkMap = setInterval(function() {
        if (typeof rcModule.rcTouristicMap[map_id] !== undefined && $('.focus-map-pane-element-toggler').length > 0) {
            clearInterval(checkMap);
            bindMarkerClick();
        }
    }, 300);

    var bindMarkerClick = function() {
        $this.find('.focus-map-pane-element-toggler').click(function() {
            // Side Pane
            $('.focus-map-pane-element-toggler').removeClass('activePane');
            var $targetPane = $this.find('.focus-map-pane-element[data-toggle-id="' + $(this).data('toggle') + '"]');
            $targetPane.addClass('is-active').siblings('.focus-map-pane-element').removeClass('is-active');

            // Toggler Marker
            $(this).addClass('activePane');
        });
    }

    $this.find('.focus-map-pane-element.is-open').addClass('is-active');

    $this.find('.map-pane-button').click(function() {
        var activeIndex = $(this).siblings('.focus-map-pane-element.is-active').data('toggle-id').replace('focusMapEl-', '');
        activeIndex = parseInt(activeIndex, 'activeIndex');

        var prevIndex = activeIndex - 1,
            nextIndex = activeIndex + 1,
            firstPaneElId = $this.find('.focus-map-pane-element').first().data('toggle-id'),
            lastPaneElId = $this.find('.focus-map-pane-element').last().data('toggle-id');

        if ($this.find('.focus-map-pane-element[data-toggle-id="' + firstPaneElId + '"]').hasClass('is-active')) {
            prevIndex = parseInt(lastPaneElId.replace('focusMapEl-', ''));
        }

        if ($this.find('.focus-map-pane-element[data-toggle-id="' + lastPaneElId + '"]').hasClass('is-active')) {
            nextIndex = parseInt(firstPaneElId.replace('focusMapEl-', ''));
        }

        $this.find('.focus-map-pane-element.is-active').removeClass('is-open').removeClass('is-active');
        $this.find('.leaflet-marker-icon').find('.activePane').removeClass('activePane');

        if ($(this).hasClass('map-pane-button-next')) {
            $this.find('.focus-map-pane-element[data-toggle-id="focusMapEl-' + nextIndex + '"]').addClass('is-open').addClass('is-active');
            $this.find('.focus-map-pane-element-toggler[data-toggle="focusMapEl-' + nextIndex + '"]').addClass('activePane');
        }
        if ($(this).hasClass('map-pane-button-prev')) {
            $this.find('.focus-map-pane-element[data-toggle-id="focusMapEl-' + prevIndex + '"]').addClass('is-open').addClass('is-active');
            $this.find('.focus-map-pane-element-toggler[data-toggle="focusMapEl-' + prevIndex + '"]').addClass('activePane');
        }
    });

});

//
// Filtres des listes de contenu => rechargement de la carte à l'ouverture des filtres
//
$('.accordion.has_map').on({
    'down.zf.accordion': function() {
        var $this = $(this);
        var map_id = $this.find("div[class^='geomap-']").attr('id');

        if (typeof map_id != 'undefined') {
            reloadMapBounds(map_id);

            // On ajoute un champ de recherche par ville si on trouve un filtre de type carte
            $this.find('.filter-item .woody-component-geomap').each(function() {

                var $mapEl = $(this),
                    // On récupère l'objet TouristicMaps correspondant
                    mapObj = rcModule.rcTouristicMap[map_id];

                // Si les limites de la carte n'ont pas encore été définies, on les calcule pour les passer en viewbox au nominatim OSM
                var checkMap = setInterval(function() {
                    if (typeof mapObj != "undefined") {
                        clearInterval(checkMap);
                        if (typeof mapObj.alreadyBounded == 'undefined') {
                            var mapBounds = mapObj.getBounds(),
                                limits = [];

                            limits.push(mapBounds['_southWest']['lng']);
                            limits.push(mapBounds['_northEast']['lat']);
                            limits.push(mapBounds['_northEast']['lng']);
                            limits.push(mapBounds['_southWest']['lat']);

                            mapObj.viewBox = limits.join(',');
                            mapObj.alreadyBounded = true;
                        }
                    }
                }, 300);

                // Ajout de l'élément html de recherche par ville
                $mapEl.append('<div class="city-filter-wrapper isAbs"><input type="text" class="city-filter" placeholder="Recherche par ville"/><span class="wicon wicon-024-loupe isAbs"></span></div>');

                // Lors de la saisie dans le champ de recherche déplace le centre de la carte en fonction de la commune choisie
                $('.city-filter').keyup(debounce(function() {
                    getCity($(this).val(), mapObj, mapObj.viewBox, $(this).parent('.city-filter-wrapper'));
                }, 800));
            });
        }

    },
});

// Permet d'annuler une requête en cours si la saisie dans le champ de recherche n'est pas terminée
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this,
            args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

// On récupère les coordonnées de la ville choisie dans le champ de recherche et on déplace le centre de la carte sur cette ville
function getCity(cityName, map, viewBox, $wrapper) {

    $wrapper.addClass('ajaxload');
    // url => On appelle le nominatim OSM en limitant la recherche à 1 résultat, contenu dans les limites de la carte de base
    $.ajax({
        url: 'https://nominatim.openstreetmap.org/search/?format=json&limit=1&viewbox=' + viewBox + '&bounded=1&city=' + cityName,
        method: "POST",
        dataType: "json",
        success: function(data) {
            // Si le nominatim OSM renvoie un résultat, on modifie le centre et le zoom de la carte
            if (typeof map != 'undefined' && typeof data[0] != 'undefined') {
                map.setView(new L.LatLng(data[0].lat, data[0].lon), 10);
            }

            $wrapper.removeClass('ajaxload');
        },
        error: function(xhr, status, error) {
            console.log('Submission failed: ' + error);
            $('body').removeClass('ajaxload');
        }
    });
}

//
// Groupes d'onglets => si une carte est présente dans l'onglet actif, rechargement de cette dernière
//
$('.tabs').on({
    'change.zf.tabs	': function(e) {
        var $tabs = $(e.target);
        var map_id = $tabs.closest('.woody-component').find('.tabs-content .tabs-panel.is-active').find("div[class^='geomap-']").attr('id');

        if (typeof map_id != 'undefined') {
            reloadMapBounds(map_id);
        }
    }
});

$('.woody-component-focus-map.hidden-map').each(function() {
    var $this = $(this);
    var $toggleMap = $this.find('.toggle-map');

    $toggleMap.click(function() {
        if ($(this).hasClass('map-opened')) {
            $(this).removeClass('map-opened');
            $this.removeClass('map-opened');
        } else {
            $(this).addClass('map-opened');
            $this.addClass('map-opened');
            var elHeight = $this.find('.woody-component-basic-swiper').height();
            var $map = $this.find("div[id^='geomap-']");
            var map_id = $map.attr('id');
            $map.height(parseInt(elHeight) - 10);
            if (typeof map_id != 'undefined') {
                reloadMapBounds(map_id);
            }
        }
    });
});

$('.tabs-panel.is-active').each(function() {
    var map_id = $(this).find("div[class^='geomap-']").attr('id');
    if (typeof map_id != 'undefined') {
        // TODO: Voir pour récupérer un event indiquant que rcModule est prêt
        function mapLoaded() {
            if (typeof rcModule.rcTouristicMap[map_id] != 'undefined') {
                rcModule.rcTouristicMap[map_id].loaded = true;
                clearInterval(checkMapLoaded);
            }
        }
        var checkMapLoaded = setInterval(mapLoaded, 300);
    }
});

//
// Recalcul de la hauteur de la carte + application des bounds
//
function reloadMapBounds(map_id) {
    if (typeof rcModule.rcTouristicMap[map_id] !== 'undefined' && typeof rcModule.rcTouristicMap[map_id].loaded == 'undefined') {
        rcModule.rcTouristicMap[map_id].on('moveend', getAndFitBounds);
        rcModule.rcTouristicMap[map_id].invalidateSize();
        rcModule.rcTouristicMap[map_id].loaded = true;
    }
}

function getAndFitBounds() {
    var bounds = [];
    this.eachLayer(function(layer) {
        if (typeof layer.bounds != 'undefined') {
            bounds.push(layer.bounds);
        } else if (typeof layer._latlng != 'undefined') {
            bounds.push(layer._latlng);
        }
    });
    this.off('moveend', getAndFitBounds);

    if (bounds.length != 0) {
        this.fitBounds(bounds, { paddingTopLeft: [50, 50], paddingBottomRight: [50, 50] });
    }
}
