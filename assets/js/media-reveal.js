import $ from 'jquery';

// Au clic sur une image de social wall, on la zoom au centre de l'écran et on affiche le texte Instagram
$('.media-zoom').click(function(e) {
    e.stopPropagation();
    var $this = $(this);

    // Si l'image est déjà zoomée, on reset seulement les attributs de zoom
    // Sinon, après reset des attributs, on applique le zoom à l'image cliquée
    if ($this.parent().hasClass('zoomIn')) {
        resetZoomIn();
    } else {
        resetZoomIn();

        // Traitement des cas avec/sans marges pour définir la taille de la cellule dont le contenu va passer en position absolute
        if ($(window).innerWidth < 640) {
            var gridGutterWidth = 20;
        } else {
            var gridGutterWidth = 30;
        }
        if ($this.parents('.grid-x').hasClass('grid-padding-x')) {
            var parentHeight = $this.parent().height() + gridGutterWidth;
            var parentWidth = $this.parent().width() + gridGutterWidth;
        } else {
            var parentHeight = $this.parent().height();
            var parentWidth = $this.parent().width();
        }

        // On applique une hauteur au parent de l'image qui va passer en absolute et on ajoute un filigrane à la place de l'image
        // Et on ajoute la class zoomIn
        var imgUrl = $this.find('.imageObject-img').attr('src');
        $this.parent().css({ 'height': parentHeight, 'width': parentWidth, 'position': 'relative' }).addClass('zoomIn');
        $this.parent().append('<img class="filigran" src="' + imgUrl + '" />');

        // On récupère la valeur de translation à appliquer en fonction de l'écran
        // Et on déplace l'image au centre de l'écran
        var translateX = (window.innerWidth / 2) - ($this.offset().left) - ($this.width() / 2);
        var translateY = (window.innerHeight / 2) - ($this.offset().top - $(window).scrollTop()) - ($this.height() / 2);
        $this.css('transform', 'translateX(' + translateX + 'px) translateY(' + translateY + 'px) ');

        // Si l'image est dans un swiper, on donne une classe au swiper-container pour l'affichage au zoom
        if ($this.parents().hasClass('swiper-container')) {
            $this.closest('.woody-component').addClass('media-zoom-zoomed');
        }
    }
});

// Au clic sur le body, on reset toutes les images zoomées
$('body').click(function() {
    resetZoomIn();
});

// Reset des attributs de zoom
var resetZoomIn = function() {
    $('.media-zoom').parent().attr('style', '');
    $('.media-zoom').parent().find('.filigran').remove();
    $('.media-zoom').parent().removeClass('zoomIn');
    $('.media-zoom').css('transform', 'none');

    // Si l'image est dans un swiper, on retire la classe qui avait été ajoutée au swiper-container au zoom
    if ($('.media-zoom').parents().hasClass('media-zoom-zoomed')) {
        $('.media-zoom').closest('.woody-component').removeClass('media-zoom-zoomed');
    }
}
