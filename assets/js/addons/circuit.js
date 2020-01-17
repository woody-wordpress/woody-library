import $ from 'jquery';

$('.woody-component-circuit').each(function() {
    const { __ } = wp.i18n;
    var windowWidth = window.innerWidth;

    if (windowWidth > 1024) {

        var $this = $(this),
            $minimapWrapper = $this.find('.minimap-wrapper'),
            $minimapWrapperSelect = $minimapWrapper.find('.day-select-switcher'),
            mapBottomOffset = $this.find('.tabs-panel .section:nth-of-type(1)').offset().top - 200,
            $dayTabs = $this.find('.tourtrip-days-list'),
            dayTabsOffset = $dayTabs.offset().top,
            scrolling = false,
            currentTop = 0,
            body = $("html, body"),
            stepsOffsets = {};

        // Réinitialisation de la carte - Utile pour les cartes masquées au chargement de la page
        function reloadMapBounds(map_id) {
            if (typeof rcModule.rcTouristicMap[map_id] !== 'undefined') {
                rcModule.rcTouristicMap[map_id].invalidateSize();
                rcModule.rcTouristicMap[map_id].on('moveend', getAndFitBounds);
            }
        }

        // Application du zoom auto de la carte - Utile pour les cartes masquées au chargement de la page
        function getAndFitBounds() {
            var bounds = [];
            // On récupère les coordonnées de chaque marker pour redéfinir les limites de la carte
            this.eachLayer(function(layer) {
                if (typeof layer._latlng != 'undefined') {
                    bounds.push(layer._latlng);
                }
            });
            this.fitBounds(bounds);
            this.off('moveend', getAndFitBounds);
        }

        // Affichage/Masquage des minimaps au scroll
        function mapActions(currentTop, $activeMiniMap) {

            // Si la carte principale n'est plus visible, on montre son équivalent en minimap, sinon on masque la minimap et on affiche la principale
            if (currentTop > mapBottomOffset && !$activeMiniMap.hasClass('visible')) {
                $this.find('.minimaps .day-minimap').removeClass('visible');
                $activeMiniMap.addClass('visible');
                $minimapWrapper.addClass('visible');
                $this.find('.tabs-panel.is-active .day-map').addClass('over-top');
                reloadMapBounds($activeMiniMap.attr('id'));
            } else if ($activeMiniMap.hasClass('visible') && currentTop < mapBottomOffset) {
                $activeMiniMap.removeClass('visible');
                $minimapWrapper.removeClass('visible');
                $this.find('.tabs-panel.is-active .day-map').removeClass('over-top');
            }
        }

        // Récupération de l'offset de chacune des étapes du jour actif
        function getStepsOffsets($el) {
            var daySteps = $el.find('.circuit-step');
            $.each(daySteps, function(i, step) {
                stepsOffsets[i] = $(step).offset().top - (window.innerHeight - 200);
            });
        }

        // Au click sur les markers de la carte principale, on scroll jusqu'à l'étape liée
        function mapMarkersClick($el) {
            $el.find('.day-map .circuit-marker').click(function() {
                var classes = $(this).attr('class'),
                    classesArray = classes.split(' ');

                body.animate({
                    scrollTop: $el.find('.circuit-step.' + classesArray[1]).offset().top
                }, 300, 'linear');
            });
        }

        // Actions lors du scroll
        var eventsOnScroll = function() {
            // On redéfinit les variables utiles en fonction du jour actif
            var activeDayPanelId = $this.find('.tourtrip-days-content > .tabs-panel.is-active').attr('id'),
                $activeMiniMap = $minimapWrapper.find('.day-minimap[data-active-panel="' + activeDayPanelId + '"]'),
                $activeMiniMapMarkers = $activeMiniMap.find('.circuit-marker'),
                currentTop = $(window).scrollTop(),
                currentStep = null,
                stepsLength = Object.keys(stepsOffsets).length;

            // On affiche/masque les minimaps
            mapActions(currentTop, $activeMiniMap);

            $.each(stepsOffsets, function(i, offset) {
                var step_index = parseInt(i);
                if (currentTop > offset) {
                    currentStep = step_index;
                }
            });

            // On met à jour l'index de l'étape dans le titre de la minimap active
            if (currentStep == 0) {
                $minimapWrapper.find('.step-index').html(__('Départ', 'woody-theme'));
            } else if (currentStep == stepsLength - 1) {
                $minimapWrapper.find('.step-index').html(__('Arrivée', 'woody-theme'));
            } else {
                $minimapWrapper.find('.step-index').html(__('Etape', 'woody-theme') + ' ' + currentStep);
            }

            $activeMiniMapMarkers.each(function() {
                if ($(this).hasClass('step-' + currentStep)) {
                    $(this).addClass('is-active');
                } else {
                    $(this).removeClass('is-active');
                }
            });

            // On garde les tabulations visibles en haut de page lors du scroll
            if (currentTop >= dayTabsOffset) {
                $dayTabs.addClass('sticky');
                $this.find('.tabs-content').css('margin-top', $dayTabs.height());
            } else {
                $dayTabs.removeClass('sticky');
                $this.find('.tabs-content').css('margin-top', 0);
            }

            scrolling = false;

        };

        // Suivi du scroll
        $(window).on("scroll", function() {
            if (!scrolling) {
                scrolling = true;
                !window.requestAnimationFrame ?
                    setTimeout(eventsOnScroll, 250) :
                    requestAnimationFrame(eventsOnScroll);
            }
        });

        // On définit une intervalle pout récupérer les markers de la carte principale et lancer une action au clic
        var checkMapMarkers = setInterval(function() {
            if ($this.find('.tourtrip-days-content > .tabs-panel.is-active .day-map .circuit-marker').length != 0) {
                mapMarkersClick($this.find('.tourtrip-days-content > .tabs-panel.is-active'));
                clearInterval(checkMapMarkers);
            }
        }, 200);

        // TODO: Retirer les lignes commentées si modif du comportement des tabs validé par le client
        // Changement d'onglet actif au clic dans le minimap wrapper
        // $minimapWrapper.find('.day-select-switcher-link').click(function() {
        //     var target = $(this).data('target-tab');
        //     var $targetEl = $this.find('#' + target);
        //     var $tabToActivate = $this.find('.tabs-link[href="#' + target + '"]').parent('.tabs-title');
        //     $this.find('#tourtrip-tabs').foundation('_handleTabChange', $targetEl, true);
        //     $tabToActivate.addClass('is-active');
        //     $minimapWrapperSelect.html($tabToActivate.find('.tabs-link').html());
        //     $('#day-select-switcher').foundation('close');
        //     eventsOnScroll();
        //     mapMarkersClick($this.find('.tourtrip-days-content > .tabs-panel.is-active'));
        // });

        // Actions au changement de jour - Clic sur une tab
        getStepsOffsets($this.find('.tourtrip-days-content').children('.tabs-panel.is-active').first());
        $('.tourtrip-days-list').on({
            'change.zf.tabs	': function(e) {
                var $tabs = $(e.target),
                    $tabContent = $(e.target).siblings('.tabs-content').children('.tabs-panel.is-active');

                $this.find('.tabs-panel.is-active .day-map').removeClass('over-top');
                body.animate({
                    scrollTop: $this.find('.tabs-helper').offset().top - 90
                }, 100, 'linear');

                $minimapWrapperSelect.html($tabs.find('.is-active .tabs-link').html());
                stepsOffsets = {};
                getStepsOffsets($tabContent);
                mapMarkersClick($tabContent);
            }
        });
    }

});
