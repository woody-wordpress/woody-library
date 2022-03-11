import $ from 'jquery';

function rangeSliderFilter($el) {
    var rangeSlider = $el.find('.rangeSlider'),
        rangeMin = rangeSlider.data('min'),
        rangeMax = rangeSlider.data('max'),
        start = rangeSlider.data('start'),
        stop = rangeSlider.data('stop'),
        rangeEl = rangeSlider.get(0);
    noUiSlider.create(rangeEl, {
        range: {
            'min': rangeMin - 1,
            'max': rangeMax
        },
        step: $el.data('step'),
        start: [start, stop],
        connect: true,
        behaviour: 'tap-drag',
        tooltips: true,
        format: {
            to: function (value) {
                return '<span>' + Math.round(value) + '</span><span class="caption">' + $el.data('caption') + '</span>';
            },
            from: function (value) {
                return value;
            }
        }
    });

    rangeEl.noUiSlider.on('change', updateInputs);
    rangeEl.noUiSlider.on('slide', updateInputs);

    function updateInputs(values, handle) {
        var type = $(rangeEl).data('type'),
            input_min = $(rangeEl).siblings('.' + type + '_min'),
            input_max = $(rangeEl).siblings('.' + type + '_max');
        if (handle == 0) {
            $(input_min).val(values[0].replace(/\D/g, ''));
        }

        if (handle == 1) {
            $(input_max).val(values[1].replace(/\D/g, ''));
        }
    }
}

$('.woody-component-list-full .woody-component-list-filter.type-rangeSlider').each(function () {
    var $this = $(this);
    rangeSliderFilter($this);
});

$('.woody-component-filters-wrapper').each(function () {
    var $form = $(this);

    // On récupère l'id du bouton sur lequel on a cliqué
    $("input:submit", $form).bind("click keypress", function () {
        $form.data("submittedId", this.id);
    });

    $form.on('submit', function (e) {
        // Au clic sur reset, on vide les params, sinon, on y ajoute les valeurs du formulaire
        if ($form.data("submittedId").indexOf('reset') !== -1) {
            var params = [];
        } else {
            var params = $(this).serialize();
        }

        var $currentList = $($form.parents('.woody-component-list-full'));
        var listId = $currentList.attr('id');

        // On ajoute un loader et on lance la requête ajax
        $('body').addClass('ajaxload');
        e.preventDefault();
        $.ajax({
            url: $form.attr('action'),
            data: params,
            method: "GET",
            dataType: "html",
            success: function (data, params, url) {
                // On remplace la grille, les filtres et la carte avec le DOM retourné par la requête Ajax
                $('#' + listId + ' .the_grid').html($(data).find('#' + listId + ' .the_grid').html());
                $('#' + listId + ' .the_filter .items-count').html($(data).find('#' + listId + ' .the_filter .items-count').html());
                $('#' + listId + ' .woody-component-geomap').html($(data).find('#' + listId + ' .woody-component-geomap').html());

                // S'il y a assez de pages pour paginer, on remplace la pagination
                if ($(data).find('#' + listId + ' .the_pager').length == 0) {
                    $('#' + listId + ' .the_pager').html('');
                } else {
                    $('#' + listId + ' .the_pager').html($(data).find('#' + listId + ' .the_pager').html());
                    $('#' + listId + ' .the_pager .page-numbers a').click(function (e) {
                        ajaxListPaginate(e, $(this));
                    });

                }

                // Si le clic
                if ($form.data("submittedId").indexOf('reset') !== -1) {

                    $form.find("input[type='checkbox']").each(function () {
                        $(this).prop("checked", false);
                    });
                    $form.find(".rangeSlider").each(function () {
                        let range = $(this);
                        let min = range.data('min');
                        let max = range.data('max');
                        range[0].noUiSlider.set([min, max]);
                    });
                    $form.find("select").each(function () {
                        $(this).find("option").first().attr("selected", true);
                        $(this).find("option").attr("selected", false);
                    });
                }

                var map_id = $('#' + listId).find('.map-wrapper [class*="geomap"]').attr('id');
                if (typeof map_id != 'undefined') {
                    rcModule.rcTouristicMap.initialize();
                    reloadMapBounds(map_id);

                    // On rajoute la recherche dans le composant de la carte
                    $('#' + listId).find('.filter-item .woody-component-geomap').each(function () {

                        var $mapEl = $(this),
                        // On récupère l'objet TouristicMaps correspondant
                        mapObj = rcModule.rcTouristicMap[map_id];
                        // Ajout de l'élément html de recherche par ville
                        $mapEl.append('<div class="city-filter-wrapper isAbs"><input type="text" class="city-filter" placeholder="Recherche par ville"/><span class="wicon wicon-024-loupe isAbs"></span></div>');

                        // Lors de la saisie dans le champ de recherche déplace le centre de la carte en fonction de la commune choisie
                        $('.city-filter').keyup(debounce(function () {
                            getCity($(this).val(), mapObj, mapObj.viewBox, $(this).parent('.city-filter-wrapper'));
                        }, 800));
                    });
                }

                // On modifie l'url de la page
                history.pushState(null, null, this.url);

                $('body').removeClass('ajaxload');
            },
            error: function (xhr, status, error) {
                console.log('Submission failed: ' + error);
                $('body').removeClass('ajaxload');
            }
        });
    });
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

var ajaxListPaginate = function (e, $el) {
    e.preventDefault();
    var target = $el.attr('href');
    // On ajoute un loader
    $('body').addClass('ajaxload');
    $.ajax({
        url: target,
        method: "GET",
        dataType: "html",
        success: function (data) {

            // On remplace les résultats et la pagination
            var $currentList = $($el.parents('.woody-component-list-full'));
            var listId = $currentList.attr('id');
            $('#' + listId + ' .the_grid').html($(data).find('#' + listId + ' .the_grid').html());
            $('#' + listId + ' .the_pager').html($(data).find('#' + listId + ' .the_pager').html());
            $('.the_pager .page-numbers a').click(function (e) {
                var $this = $(this);
                ajaxListPaginate(e, $this);
            });

            // On modifie l'url de la page
            history.pushState(null, null, this.url);

            // On remonte en haut de la liste
            $('html, body').scrollTop(parseInt($('#' + listId).offset().top - 100));

            // On retire le loader
            $('body').removeClass('ajaxload');

        },
        error: function (xhr, status, error) {
            console.log('Submission failed: ' + error);
            $('body').removeClass('ajaxload');
        }
    });
}

// On pagine en ajax
$('.the_pager .page-numbers a').click(function (e) {
    var $this = $(this);
    ajaxListPaginate(e, $this);
});

function reloadMapBounds(map_id) {
    var the_map = rcModule.rcTouristicMap[map_id];
    if (typeof the_map != 'undefined') {
        the_map.invalidateSize();
        var bounds = [];
        the_map.eachLayer(function(layer) {
            if (typeof layer._latlng != 'undefined') {
                bounds.push(layer._latlng);
            }
        });

        if (bounds.length > 0) {
            the_map.fitBounds(bounds);
        }

    }
}
