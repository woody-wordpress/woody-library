import $ from 'jquery';

if ( window.innerWidth >= 1024 ) {
    $( '.woody-component-focus.tpl_313 .card' ).each( function ()
    {
        var $this = $( this ),
            imageHeight = $this.find( '.imageObject-img' ).height();

        $this.find( '.card-section' ).css( 'height', imageHeight + 'px' );

    } );
}
