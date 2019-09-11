import $ from 'jquery';
import { Foundation } from 'foundation-sites/js/foundation.core';
import { Accordion } from 'foundation-sites/js/foundation.accordion';
Foundation.plugin( Accordion, 'Accordion' );
Foundation.addToJquery( $ );

$( '.page' ).each( function ()
{
    // Instanciation des accordions Foundation
    $( '.accordion' ).foundation();

    // On recherche si le # dans l'url
    var hash = window.location.hash;
    if ( hash.length > 1 ) {
        var searchedId = hash.replace( '#', '' ),
            $theAnchor = $( '#' + searchedId );
        if ( $theAnchor.length ) {
            var accordionParentId = $theAnchor.closest( '.accordion' ).attr( 'id' ),
                accordionRowParentId = $theAnchor.closest( '.accordion-content' ).attr( 'id' );
            if ( typeof accordionParentId != 'undefined' ) {
                $( '#' + accordionParentId ).foundation( 'down', $( '#' + accordionRowParentId ) );
                $( '#' + accordionParentId ).find( '.is-active' ).find( '.accordion-title' ).focus();
                $( window ).scrollTop( $( '#' + accordionRowParentId ).offset().top );
            }
        }
    }
} );

