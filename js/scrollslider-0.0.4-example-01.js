;( function( $, window, document, undefined ) {

    $( function() {

        $( '.stage.info .scrollslider' ).scrollslider( {
            // width           : '498',
            // height          : '350',
            items   : {
                distribution    : 'static',
                // width           : '488',
                // height          : '330',
                centeronclick   : false
            },
            buttons : {
                prev            : $( '.stage.info .prev' ),
                next            : $( '.stage.info .next' )
            },
            styles  : {
                item            : {
                    'cursor'        : 'default',
                    'width'         : '468px',
                    'height'        : '330px'
                }
            }
        } );

        $( window ).hashchange( function() {
            var hash = location.hash.replace( /^#/, '.' );

            var $item = $( '.stage.info .scrollslider' ).children().filter( hash );
            $( '.stage.info .scrollslider' ).scrollslider( 'scrollToCenterItem', $item );
        } );

        $( '.stage.info .scrollslider' ).children().on( 'scrollslider-shown', function() {
            location.hash= $(this).attr('class').replace( /^.*\s*item\s*(\S+).*$/, '#$1' );
        } );

        // $( 'a', '.stage.info .scrollslider' ).on( 'click', function( event ) {
        //     var $this = $( this );
        //     if ( $this.attr( 'href' ).match( /^#/ ) ) {
        //         event.preventDefault();
        //     }
        // } );


        if ( location.hash ) {
            var hash = location.hash.replace( /^#/, '.' );

            var $item = $( '.stage.info .scrollslider' ).children().filter( hash );
            $( '.stage.info .scrollslider' ).scrollslider( 'goToCenterItem', $item );
        }



// return;

        var configs = [];

        configs.push( {
            } );

        configs.push( {
                items           : {
                    align           : {
                        vert            : 'bottom'
                    },
                    gap         : '20'
                }
            } );

        configs.push( {
                items           : {
                    align           : {
                        vert            : 'bottom'
                    },
                    gap         : '20',
                    centerable  : true
                }
            } );

        configs.push( {
                items           : {
                    align           : {
                        horz            : 'left',
                        vert            : 'bottom'
                    },
                    margins     : false,
                    gap         : '10',
                    triggerpartial  : false
                },
                help            : [ 'elements listens to the events',
                                    '»scrollslider-shown« and »scrollslider-hide«' ]
            } );

        configs.push( {
                items           : {
                    distribution    : 'static'
                }
            } );

        configs.push( {
                items           : {
                    width           : '244',
                    height          : '300',
                    distribution    : 'static',
                    triggerpartial  : false
                },
                help            : [ 'elements listens to the event »scrollslider-shown«' ]
            } );

        configs.push( {
                items           : {
                    width           : '488',
                    height          : '300',
                    distribution    : 'static'
                }
            } );

        configs.push( {
                orientation     : 'vert'
            } );

        configs.push( {
                orientation     : 'vert',
                items           : {
                    align           : {
                        horz            : 'left'
                    }
                }
            } );

        configs.push( {
                orientation     : 'vert',
                items           : {
                    width           : '488',
                    height          : '300',
                    distribution    : 'static'
                }
            } );


        var $stage = $( '.stage.demo' );

        for ( var i = 1; i < configs.length; i++ ) {
            $stage.clone().insertAfter( $stage );
        }

        $( '.stage.demo' ).each( function( num ) {
            var $stage = $( this );

            var config = configs[ num ];

            var $options = $( '.options', $stage );
            $options.html( $options.html() + '<pre>' + JSON.stringify( config, null, 4 ) + '</pre>' );
            $options.css( {
                'opacity'       : 0.5
            } );
            $options.on( 'click', function() {

                if ( 20 == $( this ).height() ) {
                    $( this ).animate( {
                        'top'       : '5px',
                        'opacity'   : '0.8',
                        'height'    : '290px'
                    } );
                } else {
                    $( this ).trigger( 'mouseleave' );
                }
                $( 'pre', $( this ) ).fadeIn();
            } );

            $stage.on( 'mouseleave', function() {
                $( '.options', $( this ) ).animate( {
                    'top'       : '275px',
                    'opacity'   : '0.5',
                    'height'    : '20px'
                } );
                $( 'pre', $( this ) ).fadeOut();
            } );

            config.buttons = {
                    prev            : $( '.prev', $stage ),
                    next            : $( '.next', $stage )
                };

            $( '.scrollslider', $stage ).scrollslider( config );
        } );


        $( '.scrollslider', $( '.stage.demo' ).eq(3) ).children().css( {
            'opacity'       : '0.25'
        } ).on( 'scrollslider-shown', function() {
            var $this = $( this );

            $this.animate( {
                'opacity'       : '1'
            } );
        } ).on( 'scrollslider-hide', function() {
            var $this = $( this );

            $this.animate( {
                'opacity'       : '0.25'
            } );
        } );
        $( '.scrollslider', $( '.stage.demo' ).eq(3) ).scrollslider( 'goTo', 0 );

        $( '.scrollslider', $( '.stage.demo' ).eq(5) ).children().on( 'scrollslider-shown', function() {
            var $this = $( this );

            $this.slideUp().slideDown();
         } );



    } );

} ( jQuery, window, document, undefined ) );
