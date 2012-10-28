;( function( $, window, document, undefined ) {

    $( function() {


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
                help            : [ 'elements listen to the events',
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
                    align           : {
                        horz            : 'center',
                        vert            : 'middle'
                    },
                    triggerpartial  : false
                },
                help            : [ 'elements listen to the event »scrollslider-shown«' ]
            } );

        configs.push( {
                items           : {
                    width           : '488',
                    height          : '300',
                    distribution    : 'static',
                    align           : {
                        horz            : 'center',
                        vert            : 'middle'
                    }
                }
            } );

        configs.push( {
                orientation     : 'vert'
            } );

        configs.push( {
                orientation     : 'vert',
                items           : {
                    align           : {
                        horz            : 'left',
                        vert            : 'middle'
                    }
                }
            } );

        configs.push( {
                orientation     : 'vert',
                items           : {
                    width           : '488',
                    height          : '300',
                    distribution    : 'static',
                    align           : {
                        horz            : 'center',
                        vert            : 'middle'
                    }
                }
            } );


        var $stage = $( '.stage' );

        for ( var i = 1; i < configs.length; i++ ) {
            $stage.clone().insertAfter( $stage );
        }

        $( '.stage' ).each( function( num ) {
            var $stage = $( this );

            var config = configs[ num ];

            var $options = $( '.options', $stage );
            $options.html( $options.html() + '<pre>' + JSON.stringify( config, null, 4 ) + '</pre>' );
            $options.css( {
                'opacity'       : 0.5
            } );
            $options.on( 'click', function() {
                $( this ).animate( {
                    'top'       : '5px',
                    'opacity'   : '0.8',
                    'height'    : '290px'
                } );
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


        $( '.scrollslider', $( '.stage' ).eq(3) ).children().css( {
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
        $( '.scrollslider', $( '.stage' ).eq(3) ).scrollslider( 'goTo', 0 );

        $( '.scrollslider', $( '.stage' ).eq(5) ).children().on( 'scrollslider-shown', function() {
            var $this = $( this );

            $this.slideUp().slideDown();
         } );



    } );

} ( jQuery, window, document, undefined ) );
