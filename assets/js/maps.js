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
        }

    },
});

//
// Groupes d'onglets => si une carte est présentes dans l'onglet actif, rechargement de cette dernière
//
$('.tabs').on({
    'change.zf.tabs	': function(e) {
        var $tabs = $(e.target);
        var map_id = $tabs.siblings('.tabs-content').find('.tabs-panel.is-active').find("div[class^='geomap-']").attr('id');
        if (typeof map_id != 'undefined') {
            reloadMapBounds(map_id);
        }
    }
});

//
// Recalcul de la hauteur de la carte + application des bounds
//
function reloadMapBounds(map_id) {
    var the_map = rcModule.rcTouristicMap[map_id];
    the_map.invalidateSize();
    the_map.on('moveend', function() {
        var bounds = [];
        the_map.eachLayer(function(layer) {
            bounds.push(layer._latlng);
        });
        the_map.fitBounds(bounds);
        the_map.off('moveend');
    });
}
