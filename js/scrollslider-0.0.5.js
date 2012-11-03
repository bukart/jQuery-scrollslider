/**
 * A simple slider for any HTML contents (<ul><li>…</li>…</ul>)
 *
 * @name scrollslider
 * @version 0.0.5
 * @requires jQuery v1.8.1+
 * @author Burkhard Krethlow
 * @url http://bukfixart.github.com/jQuery-scrollslider/
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright (c) 2012, Burkhard Krethlow (buk -[at]- bukart [*dot*] de)
 */


;( function( $, window, document, undefined ) {

    $.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
    };

    var __NAME__ = 'scrollslider';
    var __NMSP__ = '.' + __NAME__;
    var __VER__ = '0.0.5';


    var defaults = {
        width           : 'auto',       // auto, #px
        height          : 'auto',       // auto, #px
        orientation     : 'horz',       // vert, horz
        items           : {
            width           : 'auto',       // auto, #px
            height          : 'auto',       // auto, #px
            distribution    : 'auto',       // auto, static
            align           : {
                horz            : 'center',     // left, center, right
                vert            : 'middle'      // top, middle, bottom
            },
            margins         : true,         // boolean
            gap             : '0px',        // #px
            centerable      : false,        // boolean
            centeronclick   : true,         // boolean
            triggerpartial  : true
        },
        buttons         : {
            prev            : null,         // selector, dom-node, jquery-element
            next            : null          // selector, dom-node, jquery-element
        },
        styles          : {
            base            : {
                'overflow'      : 'hidden',
                'position'      : 'relative'
            },
            item            : {
                'position'      : 'absolute'
            },
            helper          : {
                'position'      : 'absolute',
                'left'          : '0px',
                'top'           : '0px',
                'visibility'    : 'hidden',
                'z-index'       : 0
            }
        }
    };

    var tools = {};

    tools.val2px = ( function val2px( val, max, min ) {
        if ( undefined === val || null === val ) {
                $.error( '\nval2px: Parameter "val" must be an instance of Number or String' + '\ncalled from: ' + arguments.callee.caller.name );
            return false;
        }

        var relative = null;


        if ( String === val.constructor ) {
            var match = null;

            if ( null === ( match = val.match( /^\s*([+\-]?\d+(\.\d+)?)(px|em|%)?\s*$/ ) ) ) {
                $.error( '\nval2px: Parameter "val" contains unsupported format "' + val + '"' + '\ncalled from: ' + arguments.callee.caller.name );
                return false;
            }

            val = parseFloat( match[ 1 ], 10 );
            var decimals = match[ 2 ];
            var unit = match[ 3 ];

            val *= ( 'em' === unit ? 16 : ( '%' === unit ? 0.01 : 1 ) );
            relative = ( '%' === unit || ( undefined === unit && undefined !== decimals ) ? true : ( undefined === unit ? relative : false ) );
        }

        if ( undefined === max ) {
            if ( relative ) {
                $.error( '\nval2px: Parameter "max" missed, for relative mode' + '\ncalled from: ' + arguments.callee.caller.name );
                return false;
            }
            val = Math.round( val );
        } else {
            if ( relative || val % 1 !== 0 ) {
                min = ( undefined !== min ? min : 0 );
                val = Math.round( min + (max - min) * val );
            }
        }

        return val;
    } );

    tools.pid = ( function pid() {
        return this.pid.prototype.pid++;
    } );
    tools.pid.prototype.pid = 0;

    tools.arrayDiff = ( function arrayDiff( a, b ) {
        return a.filter( function( i ) { return !( b.indexOf( i ) > -1); } );
    } );

    tools.arrayIntersect = ( function arrayDiff( a, b ) {
        return a.filter( function( i ) { return !( b.indexOf( i ) < 0); } );
    } );


    var _plugin = function() {
        this.options = {};
        this.settings = {};
        this.components = {};
        this.data = {};
    };

    _plugin.prototype.storeSettings = ( function storeSettings( options ) {
        this.options = $.extend( true, {}, options );
        this.settings = $.extend( true, {}, defaults, options );
    } );

    _plugin.prototype.getSettings = ( function getSettings( path ) {
        if ( undefined === path || '' === path ) {
            return this.settings;
        }

        path = path.split( '\/' );
        var scope = this.settings;

        for ( var i = 0; i < path.length; i++ ) {
            if ( undefined === ( scope = scope[ path[ i ] ] ) ) {
                return undefined;
            }
        }

        return scope;
    } );

    _plugin.prototype.getData = ( function getData( path ) {
        if ( undefined === path || '' === path ) {
            return this.data;
        }

        path = path.split( '\/' );
        var scope = this.data;

        for ( var i = 0; i < path.length; i++    ) {
            if ( undefined === ( scope = scope[ path[ i ] ] ) ) {
                return undefined;
            }
        }

        return scope;
    } );

    _plugin.prototype.setData = ( function setData( data, path ) {
        if ( undefined === path || '' === path ) {
            this.data = data;
            return;
        }

        path = path.split( '\/' );
        var lastscope = this.data;
        var scope = null;
        var c = path.length;

        for ( var i = 0; i < c; i++ ) {
            if ( undefined === ( scope = lastscope[ path[ i ] ] ) ) {
                lastscope[ path[ i ] ]
                    = scope
                    = {};
            }

            if ( c - 1 === i ) {
                lastscope[ path[ i ] ] = data;
            }
            lastscope = scope;
        }

    } );

    _plugin.prototype.getComponents = ( function getComponents( component ) {
        return ( undefined === component ? this.components : this.components[ component ] );
    } );

    _plugin.prototype.setComponents = ( function setComponents( components, component ) {
        if ( undefined === component ) {
            this.components = components;
        } else {
            this.components[ component ] = components;
        }
    } );



    _plugin.prototype.pxWidth = ( function pxWidth() {
        var width = this.getSettings( 'width' );
        width = (width && String === width.constructor && null !== width.match( /^\s*(\d+)(?:px)?\s*$/ ) )
            || (width && Number === width.constructor && 0 < width ) ? width : false;
        return ( false !== width ? parseInt( width, 10 ) : false );
    } );

    _plugin.prototype.pxHeight = ( function pxHeight() {
        var height = this.getSettings( 'height' );
        height = (height && String === height.constructor && null !== height.match( /^\s*(\d+)(?:px)?\s*$/ ) )
            || (height && Number === height.constructor && 0 < height ) ? height : false;
        return ( false !== height ? parseInt( height, 10 ) : false );
    } );

    _plugin.prototype.pxItemsWidth = ( function pxItemsWidth() {
        var itemsWidth = this.getSettings( 'items/width' );
        itemsWidth = (itemsWidth && String === itemsWidth.constructor && null !== itemsWidth.match( /^\s*(\d+)(?:px)?\s*$/ ) )
            || (itemsWidth && Number === itemsWidth.constructor && 0 < itemsWidth ) ? itemsWidth : false;
        return ( false !== itemsWidth ? parseInt( itemsWidth, 10 ) : false );
    } );

    _plugin.prototype.pxItemsHeight = ( function pxItemsHeight() {
        var itemsHeight = this.getSettings( 'items/height' );
        itemsHeight = (itemsHeight && String === itemsHeight.constructor && null !== itemsHeight.match( /^\s*(\d+)(?:px)?\s*$/ ) )
            || (itemsHeight && Number === itemsHeight.constructor && 0 < itemsHeight ) ? itemsHeight : 0;
        return ( false !== itemsHeight ? parseInt( itemsHeight, 10 ) : false );
    } );

    _plugin.prototype.pxGap = ( function pxGap() {
        var itemsGap = this.getSettings( 'items/gap' );
        itemsGap = (itemsGap && String === itemsGap.constructor && null !== itemsGap.match( /^\s*(\d+)(?:px)?\s*$/ ) )
            || (itemsGap && Number === itemsGap.constructor && 0 < itemsGap ) ? itemsGap : false;

        return ( false !== itemsGap ? parseInt( itemsGap, 10 ) : false );
    } );

    _plugin.prototype.isHorz = ( function isHorz() {
        return ( 'horz' === this.getSettings( 'orientation' ) );
    } );

    _plugin.prototype.isVert = ( function isVert() {
        return ( 'vert' === this.getSettings( 'orientation' ) );
    } );

    _plugin.prototype.hasAutoItemsDistribution = ( function hasAutoItemsDistribution() {
        return ( 'auto' === this.getSettings( 'items/distribution' ) );
    } );

    _plugin.prototype.hasStaticItemsDistribution = ( function hasStaticItemsDistribution() {
        return ( 'static' === this.getSettings( 'items/distribution' ) );
    } );

    _plugin.prototype.hasAutoWidth = ( function hasAutoWidth() {
        var width = this.getSettings( 'width' );
        return ( 'auto' === width || false === this.pxWidth() );
    } );

    _plugin.prototype.hasAutoHeight = ( function hasAutoHeight() {
        var height = this.getSettings( 'height' );
        return ( 'auto' === height || false === this.pxHeight() );
    } );

    _plugin.prototype.hasAutoItemsWidth = ( function hasAutoItemsWidth() {
        var itemsWidth = this.getSettings( 'items/width' );
        return ( 'auto' === itemsWidth || false === this.pxItemsWidth() );
    } );

    _plugin.prototype.hasAutoItemsHeight = ( function hasAutoItemsHeight() {
        var itemsHeight = this.getSettings( 'items/height' );
        return ( 'auto' === itemsHeight || false === this.pxItemsHeight() );
    } );

    _plugin.prototype.itemsAlignTop = ( function itemsAlignTop() {
        return ( 'top' === this.getSettings( 'items/align/vert' ) );
    } );

    _plugin.prototype.itemsAlignMiddle = ( function itemsAlignMiddle() {
        return ( 'middle' === this.getSettings( 'items/align/vert' ) );
    } );

    _plugin.prototype.itemsAlignBottom = ( function itemsAlignBottom() {
        return ( 'bottom' === this.getSettings( 'items/align/vert' ) );
    } );

    _plugin.prototype.itemsAlignLeft = ( function itemsAlignLeft() {
        return ( 'left' === this.getSettings( 'items/align/horz' ) );
    } );

    _plugin.prototype.itemsAlignCenter = ( function itemsAlignCenter() {
        return ( 'center' === this.getSettings( 'items/align/horz' ) );
    } );

    _plugin.prototype.itemsAlignRight = ( function itemsAlignRight() {
        return ( 'right' === this.getSettings( 'items/align/horz' ) );
    } );

    _plugin.prototype.itemsCenterable = ( function itemsCenterable() {
        return ( true === this.getSettings( 'items/centerable' ) );
    } );

    _plugin.prototype.limitPosition = ( function limitPosition( pos ) {
        if ( undefined === pos || null === pos || Number != pos.constructor ) {
            return 0;
        }
        return Math.round( pos < this.minPosition() ? this.minPosition() : ( pos > this.maxPosition() ? this.maxPosition() : pos ) );
    } );

    _plugin.prototype.limitIndex = ( function limitIndex( itemIndex ) {
        if ( !itemIndex || Number !== itemIndex.constructor ) {
            return 0;
        }
        return Math.round( itemIndex < 0
                ? 0
                : ( itemIndex > this.getData( 'items/number' )
                    ? this.getData( 'items/number' ) - 1
                    : itemIndex ) );
    } );

    _plugin.prototype.indexOf = ( function indexOf( item ) {
        var itemIndex = false;
        if ( !item || Number === item.constructor ) {
            itemIndex = this.limitIndex( item );
        } else if ( jQuery === item.constructor ) {
            itemIndex = this.getComponents( 'items' ).index( item );
        }

        return ( -1 !== itemIndex && false !== itemIndex ? itemIndex : false );
    } );

    _plugin.prototype.currentViewport = ( function currentViewport() {
        var pos = this.limitPosition( this.getData( 'position/current' ) );
        var viewport = {
            from        : pos,
            to          : pos + this.getData( 'range/size' ) - 1,
            size        : this.getData( 'range/size' )
        };
        return viewport;
    } );

    _plugin.prototype.viewportAt = ( function viewportAt( pos ) {
        pos = this.limitPosition( pos );
        var viewport = {
            from        : pos,
            to          : pos + this.getData( 'range/size' ) - 1,
            size        : this.getData( 'range/size' )
        };
        return viewport;
    } );

    _plugin.prototype.indexesInViewport = ( function indexesInViewport( viewport, outer, complete ) {
        viewport = undefined !== viewport ? viewport : this.currentViewport();
        outer = undefined !== outer ? outer : false;
        complete = undefined !== complete ? complete : false;
        var items = [];
        var itemRanges = this.getData( 'items/ranges' );
        for ( var i = 0; i < itemRanges.length; i++ ) {
            var range = itemRanges[ i ][ ( outer ? 'outer' : 'inner' ) ];

            if ( !complete && range.to >= viewport.from && range.from <= viewport.to ) {
                items.push( i );
            } else if ( complete && range.to <= viewport.to && range.from >= viewport.from ) {
                items.push( i );
            }
        }
        return items;
    } );

    _plugin.prototype.componentItemsInViewports = ( function componentItemsInViewports( viewportA, viewportB ) {
        var iA = this.indexesInViewport(viewportA, false, !this.getSettings( 'items/triggerpartial' ) );
        var iB = this.indexesInViewport(viewportB, false, !this.getSettings( 'items/triggerpartial' ) );

        var dA = tools.arrayDiff( iA, iB );
        var dB = tools.arrayDiff( iB, iA );

        var items = this.getComponents( 'items' );

        var result = { A : [], B : [] };

        for ( var i = 0; i < dA.length; i++ ) {
            result.A.push( items[ dA[ i ] ] );
        }
        for ( var i = 0; i < dB.length; i++ ) {
            // result.B.push( items[ dB[ i ] ] );
        }
        for ( var i = 0; i < iB.length; i++ ) {
            result.B.push( items[ iB[ i ] ] );
        }

        return result;
    } );


    _plugin.prototype.positionToView = ( function positionToView( item ) {
        var range = this.getData( 'items/ranges/' + this.indexOf( item ) );
        var viewport = this.currentViewport();
        var position = null;

        if ( !range ) {
            return false;
        }

        if ( range.inner.size <= viewport.size ) {
            if ( range.inner.to > viewport.to ) {
                position = range.inner.to - viewport.size + 1;
            } else if ( range.inner.from < viewport.from ) {
                position = range.inner.from;
            } else {
                position = this.getData( 'position/current' );
            }
        } else {
            position = this.positionToCenter( item );
        }

        return position;
    } );

    _plugin.prototype.positionToCenter = ( function positionToCenter( item ) {
        var range = this.getData( 'items/ranges/' + this.indexOf( item ) );
        var viewport = this.currentViewport();

        if ( !range ) {
            return false;
        }

        return Math.floor( range.inner.center - viewport.size  / 2 );
    } );


    _plugin.prototype.currentPosition = ( function currentPosition() {
        return this.getData( 'position/current' );
    } );

    _plugin.prototype.minPosition = ( function minPosition() {
        return this.getData( 'position/min' );
    } );

    _plugin.prototype.maxPosition = ( function maxPosition() {
        return this.getData( 'position/max' );
    } );



    var intern = {};

    intern._getPlugin = ( function _getPlugin( $e ) {
        $e = ( $e ? $e : $el );
        return $e.data( __NMSP__ );
    } );

    intern._setPlugin = ( function _setPlugin( plugin ) {
        $el.data( __NMSP__, plugin );
    } );

    intern._detectButtons = ( function _detectButtons() {
        var plugin = intern._getPlugin();

        var button, $button;

        $button = $('');
        if ( button = plugin.getSettings( 'buttons/prev' ) ) {
            if ( String === button.constructor || ( 'undefined' !== typeof HTMLElement  && button instanceof HTMLElement ) ) {
                $button = $( button );
            } else if ( jQuery === button.constructor ) {
                $button = button;
            }
        }
        plugin.setComponents( $button, 'prevButton' );

        $button = $('');
        if ( button = plugin.getSettings( 'buttons/next' ) ) {
            if ( String === button.constructor || ( 'undefined' !== typeof HTMLElement && button instanceof HTMLElement ) ) {
                $button = $( button );
            } else if ( jQuery === button.constructor ) {
                $button = button;
            }
        }
        plugin.setComponents( $button, 'nextButton' );

    } );

    intern._detectItems = ( function _detectItems() {
        var plugin = intern._getPlugin();

        plugin.setComponents( $el.children().not( plugin.getComponents( 'helper' ) ), 'items' );

        plugin.getComponents( 'items' ).css( plugin.getSettings( 'styles/item' ) );

        intern._analyzeItems( this );
    } );

    intern._analyzeItems = ( function _analyzeItems() {
        var plugin = intern._getPlugin();

        var $items = plugin.getComponents( 'items' );

        var data = {
            number      : $items.size(),
            limits      : {
                outer       : {
                    min         : {
                        width       : false,
                        height      : false
                    },
                    max         : {
                        width       : false,
                        height      : false
                    }
                },
                inner       : {
                    min         : {
                        width       : false,
                        height      : false
                    },
                    max         : {
                        width       : false,
                        height      : false
                    }
                }
            },
            dimensions  : [],
            margins     : []
        };

        for ( var i = 0; i < data.number; i++ ) {
            var $item = $items.eq( i );
            var dim = {
                outer       : {
                    width       : $item.outerWidth( plugin.getSettings( 'items/margins' ) ),
                    height      : $item.outerHeight( plugin.getSettings( 'items/margins' ) )
                },
                inner       : {
                    width       : $item.outerWidth( false ),
                    height      : $item.outerHeight( false )
                }
            };
            var margins = {
                top         : parseInt( $item.css( 'margin-top' ), 10 ),
                right       : parseInt( $item.css( 'margin-right' ), 10 ),
                bottom      : parseInt( $item.css( 'margin-bottom' ), 10 ),
                left        : parseInt( $item.css( 'margin-left' ), 10 )
            };

            for ( var m in margins ) {
                margins[ m ] = ( margins[ m ] ? margins[ m ] : 0 );
            }

            data.dimensions.push( dim );
            data.margins.push( margins );

            data.limits.inner.max.width = (dim.inner.width > data.limits.inner.max.width || false === data.limits.inner.max.width ? dim.inner.width : data.limits.inner.max.width );
            data.limits.inner.max.height = (dim.inner.height > data.limits.inner.max.height || false === data.limits.inner.max.height ? dim.inner.height : data.limits.inner.max.height );
            data.limits.outer.max.width = (dim.outer.width > data.limits.outer.max.width || false === data.limits.outer.max.width ? dim.outer.width : data.limits.outer.max.width );
            data.limits.outer.max.height = (dim.outer.height > data.limits.outer.max.height || false === data.limits.outer.max.height ? dim.outer.height : data.limits.outer.max.height );

            data.limits.inner.min.width = (dim.inner.width < data.limits.inner.min.width || false === data.limits.inner.min.width ? dim.inner.width : data.limits.inner.min.width );
            data.limits.inner.min.height = (dim.inner.height < data.limits.inner.min.height || false === data.limits.inner.min.height ? dim.inner.height : data.limits.inner.min.height );
            data.limits.outer.min.width = (dim.outer.width < data.limits.outer.min.width || false === data.limits.outer.min.width ? dim.outer.width : data.limits.outer.min.width );
            data.limits.outer.min.height = (dim.outer.height < data.limits.outer.min.height || false === data.limits.outer.min.height ? dim.outer.height : data.limits.outer.min.height );

            if ( !plugin.getSettings( 'items/margins' ) ) {
                $item.css( { 'margin' : '0px' } );
            }
        }


        var applied = {
            items       : {
                width       : ( plugin.hasAutoItemsWidth() ? ( plugin.isHorz() || plugin.hasAutoWidth() ? data.limits.outer.max.width : plugin.pxWidth() ) : plugin.pxItemsWidth() ),
                height      : ( plugin.hasAutoItemsHeight() ? ( plugin.isVert() || plugin.hasAutoHeight() ? data.limits.outer.max.height : plugin.pxHeight() ) : plugin.pxItemsHeight() )
            }
        };

        plugin.setData( applied.items.width, 'applied/items/width' );
        plugin.setData( applied.items.height, 'applied/items/height' );

        plugin.setData( data, 'items' );
    } );

    intern._bindHandlers = ( function _bindHandlers() {
        var plugin = intern._getPlugin();

        ( function( $el ) {
            var $items = plugin.getComponents( 'items' );

            var pid = plugin.getData( 'pid' );

            if ( plugin.getSettings( 'items/centeronclick' ) ) {
                $items.off( __NMSP__ + pid ).on( 'click' + __NMSP__ + pid, function( ev ) {
                    var $item = $( this );
                    methods.scrollToCenterItem.call( $el, $item );
                } );
            }

            var $prevbutton = plugin.getComponents( 'prevButton' );
            if ( $prevbutton ) {
                $prevbutton.off(  __NMSP__ + pid ).on( 'click' + __NMSP__ + pid, function( ev ) {
                    // methods.scrollToPrevPage.call( $el );
                    methods.scrollToPrevItem.call( $el );
                    ev.preventDefault();
                    return false;
                } );
            }

            var $nextbutton = plugin.getComponents( 'nextButton' );
            if ( $nextbutton ) {
                $nextbutton.off( __NMSP__ + pid ).on( 'click' + __NMSP__ + pid, function( ev ) {
                    // methods.scrollToNextPage.call( $el );
                    methods.scrollToNextItem.call( $el );
                    ev.preventDefault();
                    return false;
                } );
            }
            $prevbutton.disableSelection();
            $nextbutton.disableSelection();

        } ( $el ) );

    } );


    intern._adjustSize = ( function _adjustSize() {
        var plugin = intern._getPlugin();

        var applied = {}, width = false, height = false;

        if ( plugin.isHorz() ) {
            if ( width = plugin.pxWidth() ) {
            } else if ( plugin.hasAutoWidth() || false !== width ) {
                if ( 0 === ( width = plugin.getComponents( 'base' ).parent().width() ) ) {
                    if ( plugin.hasAutoItemsWidth() ) {
                        width = plugin.getData( 'items/limits/outer/max/width' );
                    } else {
                        width = plugin.pxItemsWidth();
                    }
                }
            }

            if ( height = plugin.pxHeight() ) {
            } else if ( plugin.hasAutoHeight() || false !== height ) {
                height = plugin.getData( 'items/limits/outer/max/height' );
            }
        }

        if ( plugin.isVert() ) {
            if ( width = plugin.pxWidth() ) {
            } else if ( plugin.hasAutoWidth() || false !== width ) {
                width = plugin.getData( 'items/limits/outer/max/width' );
            }

            if ( height = plugin.pxHeight() ) {
            } else if ( plugin.hasAutoHeight() || false !== height ) {
                if ( 0 === ( height = plugin.getComponents( 'base' ).parent().height() ) ) {
                    if ( plugin.hasAutoItemsHeight() ) {
                        height = plugin.getData( 'items/limits/outer/max/height' );
                    } else {
                        height = plugin.pxItemsHeight();
                    }
                }
            }
        }


        applied.width = ( plugin.hasAutoItemsWidth() || plugin.isHorz() || !plugin.hasAutoWidth() ? width : plugin.pxItemsWidth() );
        applied.height = ( plugin.hasAutoItemsHeight() || plugin.isVert() || !plugin.hasAutoHeight() ? height : plugin.pxItemsHeight() );

        plugin.getComponents( 'base' ).width( applied.width ).height( applied.height );

        plugin.setData( applied.width, 'applied/width' );
        plugin.setData( applied.height, 'applied/height' );
        plugin.setData( ( plugin.isHorz() ? width : ( plugin.isVert() ? height : 0 ) ), 'range/size' );
    } );


    intern._arrangeItems = ( function _arrangeItems() {
        var plugin = intern._getPlugin();

        var number = plugin.getData( 'items/number' );
        var $items = plugin.getComponents( 'items' );

        var width = plugin.getData( 'applied/width' );
        var height = plugin.getData( 'applied/height' );
        var itemsWidth = plugin.getData( 'applied/items/width' );
        var itemsHeight = plugin.getData( 'applied/items/height' );
        var shiftHorz = Math.floor( ( width - itemsWidth ) / 2 );
        var shiftVert = Math.floor( ( height - itemsHeight ) / 2 );

        var data = {
            locations       : [],
            ranges          : []
        };

        var p = 0;

        for ( var i = 0; i < number; i++ ) {

            var itemOuterWidth = plugin.getData( 'items/dimensions/' + i + '/outer/width' );
            var itemOuterHeight = plugin.getData( 'items/dimensions/' + i + '/outer/height' );
            var itemInnerWidth = plugin.getData( 'items/dimensions/' + i + '/inner/width' );
            var itemInnerHeight = plugin.getData( 'items/dimensions/' + i + '/inner/height' );
            var itemMargins = plugin.getData( 'items/margins/' + i );

            if ( plugin.isHorz() ) {

                if ( 0 === i && plugin.itemsCenterable() ) {
                    if ( plugin.hasAutoItemsDistribution() ) {
                        p += ( plugin.getData( 'range/size' ) - itemInnerWidth ) / 2 -
                            ( plugin.getSettings( 'items/margins' ) ? itemMargins.left : 0 );
                    } else if ( plugin.hasStaticItemsDistribution() ) {
                        p += ( plugin.getData( 'range/size' ) - itemsWidth ) / 2 -
                            ( plugin.getSettings( 'items/margins' ) ? itemMargins.left : 0 ) / 2;
                        if ( plugin.itemsAlignLeft() ) {
                            p += ( itemInnerWidth - itemMargins.left ) /2;
                        }
                        if ( plugin.itemsAlignRight() ) {
                            p -= ( itemInnerWidth - itemMargins.left ) /2;
                        }
                    }
                }

                var horz = p;
                if ( plugin.hasAutoItemsDistribution() ) {
                    p += itemOuterWidth;
                } else if ( plugin.hasStaticItemsDistribution() ) {
                    p += itemsWidth;
                    if ( plugin.itemsAlignCenter() ) {
                        horz += ( itemsWidth - itemOuterWidth ) / 2;
                    }
                    if ( plugin.itemsAlignRight() ) {
                        horz += itemsWidth - itemOuterWidth;
                    }
                    horz = Math.floor( horz );

                }

                var vert = shiftVert;
                if ( plugin.itemsAlignMiddle() ) {
                    vert += ( itemsHeight - itemOuterHeight ) / 2;
                }
                if ( plugin.itemsAlignBottom() ) {
                    vert += itemsHeight - itemOuterHeight;
                }
                vert = Math.floor( vert );


                if ( number === i + 1 && plugin.itemsCenterable() ) {
                    if ( plugin.hasAutoItemsDistribution() ) {
                        p += ( plugin.getData( 'range/size' ) - itemInnerWidth ) / 2 -
                            ( plugin.getSettings( 'items/margins' ) ? itemMargins.right : 0 );
                    } else if ( plugin.hasStaticItemsDistribution() ) {
                        p += ( plugin.getData( 'range/size' ) - itemsWidth ) / 2 -
                            ( plugin.getSettings( 'items/margins' ) ? itemMargins.right : 0 ) / 2;
                    }
                    if ( plugin.itemsAlignLeft() ) {
                        p -= ( itemInnerWidth - itemMargins.right ) /2;
                    }
                    if ( plugin.itemsAlignRight() ) {
                        p += ( itemInnerWidth - itemMargins.right ) /2;
                    }
                }


            } else if ( plugin.isVert() ) {

                if ( 0 === i && plugin.itemsCenterable() ) {
                    if ( plugin.hasAutoItemsDistribution() ) {
                        p += ( plugin.getData( 'range/size' ) - itemInnerHeight ) / 2 -
                            ( plugin.getSettings( 'items/margins' ) ? itemMargins.top : 0 );
                    } else if ( plugin.hasStaticItemsDistribution() ) {
                        p += ( plugin.getData( 'range/size' ) - itemsHeight ) / 2 -
                            ( plugin.getSettings( 'items/margins' ) ? itemMargins.top : 0 ) / 2;
                    }
                    if ( plugin.itemsAlignTop() ) {
                        p += ( itemInnerHeight - itemMargins.top ) /2;
                    }
                    if ( plugin.itemsAlignBottom() ) {
                        p -= ( itemInnerHeight - itemMargins.top ) /2;
                    }
                }

                var vert = p;
                if ( plugin.hasAutoItemsDistribution() ) {
                    p += itemOuterHeight;
                } else if ( plugin.hasStaticItemsDistribution() ) {
                    p += itemsHeight;
                    if ( plugin.itemsAlignMiddle() ) {
                        vert += ( itemsHeight - itemOuterHeight ) / 2;
                    }
                    if ( plugin.itemsAlignBottom() ) {
                        vert += itemsHeight - itemOuterHeight;
                    }
                    vert = Math.floor( vert );
                }

                var horz = shiftHorz;
                if ( plugin.itemsAlignCenter() ) {
                    horz += ( itemsWidth - itemOuterWidth ) / 2;
                }
                if ( plugin.itemsAlignRight() ) {
                    horz += itemsWidth - itemOuterWidth;
                }
                horz = Math.floor( horz );


                if ( number === i + 1 && plugin.itemsCenterable() ) {
                    if ( plugin.hasAutoItemsDistribution() ) {
                        p += ( plugin.getData( 'range/size' ) - itemInnerHeight ) / 2 -
                            ( plugin.getSettings( 'items/margins' ) ? itemMargins.bottom : 0 );
                    } else if ( plugin.hasStaticItemsDistribution() ) {
                        p += ( plugin.getData( 'range/size' ) - itemsHeight ) / 2 -
                            ( plugin.getSettings( 'items/margins' ) ? itemMargins.bottom : 0 ) / 2;
                    }
                    if ( plugin.itemsAlignTop() ) {
                        p -= ( itemInnerHeight - itemMargins.bottom ) /2;
                    }
                    if ( plugin.itemsAlignBottom() ) {
                        p += ( itemInnerHeight - itemMargins.bottom ) /2;
                    }
                }

            }

            p += plugin.pxGap();

            var loc = {
                left        : horz,
                right       : horz + itemOuterWidth - 1,
                center      : false,
                top         : vert,
                bottom      : vert + itemOuterHeight - 1,
                middle      : false
            };
            loc.center = Math.floor( ( loc.right + loc.left ) / 2 );
            loc.middle = Math.floor( ( loc.bottom + loc.top ) / 2 );

            var range = {
                outer       : {
                    from        : ( plugin.isHorz() ? loc.left : ( plugin.isVert() ? loc.top : 0 ) ),
                    to          : ( plugin.isHorz() ? loc.right : ( plugin.isVert() ? loc.bottom : 0 ) ),
                    size        : ( plugin.isHorz() ? itemOuterWidth : ( plugin.isVert() ? itemOuterHeight : 0 ) ),
                    center      : null
                },
                inner       : {
                    from        : null,
                    to          : null,
                    size        : null,
                    center      : null
                }
            };

            range.outer.center = range.outer.from + Math.floor( range.outer.size / 2 );

            range.inner.from = range.outer.from +
                ( plugin.getSettings( 'items/margins' ) ? ( plugin.isHorz() ? itemMargins.left : ( plugin.isVert() ? itemMargins.top : 0 ) ) : 0 );
            range.inner.to   = range.outer.to -
                ( plugin.getSettings( 'items/margins' ) ? ( plugin.isHorz() ? itemMargins.right : ( plugin.isVert() ? itemMargins.bottom : 0 ) ) : 0 );
            range.inner.size = ( plugin.isHorz() ? itemInnerWidth : ( plugin.isVert() ? itemInnerHeight : 0 ) );
            range.inner.center = range.inner.from + Math.floor( range.inner.size / 2 );

            data.locations.push( loc );
            data.ranges.push( range );

            var css = {
                'left'      : horz + 'px',
                'top'       : vert + 'px'
            };

            $items.eq( i ).css( css );



        }



        plugin.setData( data.locations, 'items/locations' );
        plugin.setData( data.ranges, 'items/ranges' );

        plugin.setData( 0, 'range/min' );
        plugin.setData( p - plugin.pxGap(), 'range/max' );

        plugin.setData( plugin.getData( 'range/max' ) - ( plugin.isHorz() ? width : height ), 'position/max' );
        plugin.setData( 0, 'position/min' );

        var $helper = plugin.getComponents( 'helper' );
        if ( plugin.isHorz() ) {
            $helper.width( plugin.getData( 'range/max' ) - plugin.getData( 'range/min' ) ).height( plugin.getData( 'applied/height' ) );
        }
        if ( plugin.isVert() ) {
            $helper.height( plugin.getData( 'range/max' ) - plugin.getData( 'range/min' ) ).width( plugin.getData( 'applied/width' ) );
        }

        plugin.getComponents( 'base' ).prepend( $helper );

    } );



    var methods = {}, orig = {};

    orig.init = methods.init = ( function init( options ) {
        var $this = this;

        if ( undefined !== intern._getPlugin() ) {
            return $this;
        }

        var plugin = new _plugin();
        intern._setPlugin.call( this, plugin );

        plugin.storeSettings( options );

        plugin.setComponents( $this, 'base' );
        plugin.setData( 0, 'position/current' );
        plugin.setData( tools.pid(), 'pid' );

        plugin.getComponents( 'base' ).css( plugin.getSettings( 'styles/base' ) );

        plugin.setComponents( $( '<div/>' ).css( plugin.getSettings( 'styles/helper' ) ), 'helper' );

        intern._detectButtons( $this );
        intern._detectItems( $this );
        intern._adjustSize( $this );
        intern._arrangeItems( $this );
        intern._bindHandlers( $this );

        return $this;
    } );

    orig.settings = methods.settings = ( function settings() {
        var $this = this;
        var plugin = intern._getPlugin( $this );

        var settings = $.extend( true, {}, plugin.getSettings() );

        return settings;
    } );

    orig.status = methods.status = ( function status() {
        var $this = this;
        var plugin = intern._getPlugin( $this );

        var status = $.extend( true, {}, plugin.getData() );

        return status;
    } );

    orig.goTo = methods.goTo = ( function goTo( pos ) {
        if ( false === pos ) {
            return $this;
        }

        var $this = this;
        var plugin = intern._getPlugin( $this );

        var items = plugin.componentItemsInViewports( plugin.currentViewport(), plugin.viewportAt( pos ) );

        var prop = 'scrollLeft';

        pos = plugin.limitPosition( tools.val2px( pos, plugin.maxPosition(), plugin.minPosition() ) );
        if ( plugin.isHorz() ) {
        } else if ( plugin.isVert() ) {
            prop = 'scrollTop';
        }

        $( items.A ).trigger( __NAME__ + '-hide' );
        $( items.B ).trigger( __NAME__ + '-show' );

        plugin.getComponents( 'base' ).stop()[prop]( pos );

        $( items.A ).trigger( __NAME__ + '-hidden' );
        $( items.B ).trigger( __NAME__ + '-shown' );

        plugin.setData( pos, 'position/current' );

        return $this;
    } );

    orig.scrollTo = methods.scrollTo = ( function scrollTo( pos ) {
        if ( false === pos ) {
            return $this;
        }

        var $this = this;
        var plugin = intern._getPlugin( $this );

        var items = plugin.componentItemsInViewports( plugin.currentViewport(), plugin.viewportAt( pos ) );

        var prop = 'scrollLeft';
        var css = {};

        pos = plugin.limitPosition( tools.val2px( pos, plugin.maxPosition(), plugin.minPosition() ) );
        if ( plugin.isHorz() ) {
        } else if ( plugin.isVert() ) {
            prop = 'scrollTop';
        }
        css[ prop ] = pos;
        var args = arguments;
        args = Array.prototype.slice.apply( args, [1] );
        args.unshift( css );

        var ffound = false;
        for ( var k; k < args.length; k++ ) {
            if ( args[ k ] && Function === args[ k ].constructor ) {
                ffound = true;

                var f = args[ k ];

                args[ k ] = function() {
                    $( items.A ).trigger( __NAME__ + '-hidden' );
                    $( items.B ).trigger( __NAME__ + '-shown' );
                    f.apply( this, arguments );
                };
                break;
            }
        }

        if ( !ffound ) {
            args.push( function() {
                    $( items.A ).trigger( __NAME__ + '-hidden' );
                    $( items.B ).trigger( __NAME__ + '-shown' );
                } );
        }


        $( items.A ).trigger( __NAME__ + '-hide' );
        $( items.B ).trigger( __NAME__ + '-show' );
        plugin.getComponents( 'base' ).stop().animate.apply( $this, args );

        plugin.setData( pos, 'position/current' );

        return $this;
    } );

    orig.goToItem = methods.goToItem = ( function goToItem( item ) {
        var $this = this;
        var plugin = intern._getPlugin( $this );

        methods.goTo.call( this, plugin.positionToView( item ) );

        return $this;
    } );

    orig.scrollToItem = methods.scrollToItem = ( function scrollToItem( item ) {
        var $this = this;
        var plugin = intern._getPlugin( $this );

        var args = arguments;
        args = Array.prototype.slice.apply( args, [1] );
        args.unshift( plugin.positionToView( item ) );

        methods.scrollTo.apply( this, args );

        return $this;
    } );

    orig.goToCenterItem = methods.goToCenterItem = ( function goToCenterItem( item ) {
        var $this = this;
        var plugin = intern._getPlugin( $this );

        methods.goTo.call( this, plugin.positionToCenter( item ) );

        return $this;
    } );

    orig.scrollToCenterItem = methods.scrollToCenterItem = ( function scrollToCenterItem( item ) {
        var $this = this;
        var plugin = intern._getPlugin( $this );

        var args = arguments;
        args = Array.prototype.slice.apply( args, [1] );
        args.unshift( plugin.positionToCenter( item ) );
        methods.scrollTo.apply( this, args );

        return $this;
    } );

    orig.goFor = methods.goFor = ( function goFor( amount ) {
        var $this = this;
        var plugin = intern._getPlugin( $this );

        methods.goTo.call( this, plugin.limitPosition( plugin.getData( 'position/current' ) + amount ) );

        return $this;
    } );

    orig.scrollFor = methods.scrollFor = ( function scrollFor( amount ) {
        var $this = this;
        var plugin = intern._getPlugin( $this );

        var args = arguments;
        args = Array.prototype.slice.apply( args, [1] );
        args.unshift( plugin.limitPosition( plugin.getData( 'position/current' ) + amount ) );
        methods.scrollTo.apply( this, args );

        return $this;
    } );

    orig.goToNextPage = methods.goToNextPage = ( function goToNextPage() {
        var $this = this;
        var plugin = intern._getPlugin( $this );

        var viewport = plugin.currentViewport();
        methods.goFor.call( this, viewport.size );

        return $this;
    } );

    orig.scrollToNextPage = methods.scrollToNextPage = ( function scrollToNextPage() {
        var $this = this;
        var plugin = intern._getPlugin( $this );

        var viewport = plugin.currentViewport();
        var args = arguments;
        args = Array.prototype.slice.apply( args, [1] );
        args.unshift( viewport.size );
        methods.scrollFor.apply( this, args );

        return $this;
    } );

    orig.goToPrevPage = methods.goToPrevPage = ( function goToPrevPage() {
        var $this = this;
        var plugin = intern._getPlugin( $this );

        var viewport = plugin.currentViewport();
        methods.goFor.call( this, -viewport.size );

        return $this;
    } );

    orig.scrollToPrevPage = methods.scrollToPrevPage = ( function scrollToPrevPage() {
        var $this = this;
        var plugin = intern._getPlugin( $this );

        var viewport = plugin.currentViewport();
        var args = arguments;
        args = Array.prototype.slice.apply( args, [1] );
        args.unshift( -viewport.size );
        methods.scrollFor.apply( this, args );

        return $this;
    } );

    orig.goToNextItem = methods.goToNextItem = ( function goToNextItem() {
        var $this = this;
        var plugin = intern._getPlugin( $this );

        var last = plugin.indexesInViewport().pop();
        methods.goToItem.apply( this, last + 1 );

        return $this;
    } );

    orig.scrollToNextItem = methods.scrollToNextItem = ( function scrollToNextItem() {
        var $this = this;
        var plugin = intern._getPlugin( $this );

        var last = plugin.indexesInViewport().pop();
        var args = arguments;
        args = Array.prototype.slice.apply( args, [1] );
        args.unshift( last + 1 );
        methods.scrollToItem.apply( this, args );

        return $this;
    } );

    orig.goToPrevItem = methods.goToPrevItem = ( function goToPrevItem() {
        var $this = this;
        var plugin = intern._getPlugin( $this );

        var first = plugin.indexesInViewport().shift();
        methods.goToItem.apply( this, first - 1 );

        return $this;
    } );

    orig.scrollToPrevItem = methods.scrollToPrevItem = ( function scrollToPrevItem() {
        var $this = this;
        var plugin = intern._getPlugin( $this );

        var first = plugin.indexesInViewport().shift();
        var args = arguments;
        args = Array.prototype.slice.apply( args, [1] );
        args.unshift( first - 1 );
        methods.scrollToItem.apply( this, args );

        return $this;
    } );

    orig.goToStart = methods.goToStart = ( function goToStart() {
        var $this = this;
        var plugin = intern._getPlugin( $this );

        methods.goTo.call( this, 0 );

        return $this;
    } );

    orig.scrollToStart = methods.scrollToStart = ( function scrollToStart() {
        var $this = this;
        var plugin = intern._getPlugin( $this );

        var args = arguments;
        args = Array.prototype.slice.apply( args, [1] );
        args.unshift( 0 );
        methods.scrollTo.apply( this, args );

        return $this;
    } );

    orig.goToEnd = methods.goToEnd = ( function goToEnd() {
        var $this = this;
        var plugin = intern._getPlugin( $this );

        methods.goTo.call( this, plugin.getData( 'position/max' ) );

        return $this;
    } );

    orig.scrollToEnd = methods.scrollToEnd = ( function scrollToStart() {
        var $this = this;
        var plugin = intern._getPlugin( $this );

        var args = arguments;
        args = Array.prototype.slice.apply( args, [1] );
        args.unshift( plugin.getData( 'position/max' ) );
        methods.scrollTo.apply( this, args );

        return $this;
    } );





    var $el = $( '' );

    $.fn[ __NAME__ ] = ( function plugin( method ) {

        var $this = this;
        var _arguments = arguments;

        var retval = undefined;

        $this.each( ( function iterator() {
            var $this = $el = $( this );

            if ( methods[ method ] && Function === methods[ method ].constructor && undefined !== intern._getPlugin( $this ) ) {
                var dump = methods[ method ].apply( $this, Array.prototype.slice.call( _arguments, 1 ) );
                retval = ( undefined === retval ? dump : retval );
                return dump;
            } else if ( undefined === method || Object === method.constructor || undefined === intern._getPlugin( $this ) ) {
                var dump = methods.init.apply( $this, _arguments );
                retval = ( undefined === retval ? dump : retval );
                return dump;
            }

        } ) );

        return retval;
    } );


    $[ __NAME__ ] = ( function devPlugin( param ) {
        if ( 'intern' === param ) {
            return intern;
        }
        if ( 'methods' === param ) {
            return methods;
        }
        if ( 'orig' === param ) {
            return $.extend( true, {}, orig );
        }
        if ( 'proto' === param ) {
            return _plugin.prototype;
        }
    } );

} ( jQuery, window, document, undefined ));