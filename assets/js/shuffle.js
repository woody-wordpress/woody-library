import $ from 'jquery';
import Swiper from "swiper";

var shuffleFocuses = function() {
    $('a[href="#shuffle"]').each(function() {
        $(this).click(function(e) {
            e.preventDefault(); // On suspend l'action du lien
            var $this = $(this),

                // On récupère l'index de la section et du bloc concerné pour les passer au php
                sectionIndex = $this.parents('.page-section').attr('id').replace('pageSection-', ''),
                $targetBlockParent = $this.parents('.woody-component-focus').parent(),
                blockIndex = $targetBlockParent.index(),

                // On récupère le nombre de cards pour le passer à la fonction woodyProcessQuery
                cardsLength = $this.parents('.woody-component-focus').find('.card').length,

                // On créé un nombre aléatoire pour le passer à l'url
                rand = Math.floor(Math.random() * 16);

            $targetBlockParent.addClass('ajaxloader');

            $.ajax({
                type: 'GET',
                url: '/wp-json/woody/shuffle/focus?section_index=' + sectionIndex + '&block_index=' + blockIndex + '&post_id=' + window.globals.post_id + '&length=' + cardsLength + '&rand=' + rand,
                success: function(items) {
                    var $i = 0;
                    if (typeof items != undefined) {
                        // On remplace le contenu du block woody par le nouveau
                        $targetBlockParent.html(items);

                        // On ré-initialise le swiper s'il y en a un
                        var $swiperWrapper = $targetBlockParent.find('.swiper-container');
                        if ($swiperWrapper.length != 0) {
                            $swiperWrapper.initSwiper();
                        }

                        // Removed equalizer
                        // $targetBlockParent.find('.woody-component-focus').each(function () {
                        //     var equalizer = new Foundation.Equalizer($(this));
                        // });

                        $targetBlockParent[0].addEventListener('lazybeforeunveil', function() {
                            setTimeout(function() {
                                $targetBlockParent.removeClass('ajaxloader');
                            }, 300);
                        });

                        // On relance l'init du bouton shuffle
                        shuffleFocuses();
                    }
                },
                error: function(items) {
                    console.error('shuffle', items);
                },
            });
        });
    });
}

$('.woody-component-focus .focus-buttons').each(function() {
    shuffleFocuses();
});
