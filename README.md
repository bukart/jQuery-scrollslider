# scrollslider

A simple slider for any HTML contents.

> **Mhh... why I believe this slider is indispensable?**<br/>
> *Well, it doesn't touch your markup, and it's based on the scrolling position of the main element.*

## Usage

### Markup
```
<div class="scrollslider">
    <div>item 1</div>
    <div>item 2</div>
    …
</div>
```
### Methods

#### Initialization - `init()`
```
jQuery( '.scrollslider' ).scrollslider( [ options ] );
```
Initializes the plugin with the given [options](#default-options) which are explained below.
The [options](#default-options) are optional ;-) so you haven't to configure them.


#### `goTo()`
```
jQuery( '.scrollslider' ).scrollslider( 'goTo', pos );
```

#### `scrollTo()`
```
jQuery( '.scrollslider' ).scrollslider( 'scrollTo', pos [, default jQuery animation parameters] );
```

#### `goToItem()`
```
jQuery( '.scrollslider' ).scrollslider( 'goToItem', item );
```

#### `scrollToItem()`
```
jQuery( '.scrollslider' ).scrollslider( 'scrollToItem', item [, default jQuery animation parameters] );
```

#### `goToCenterItem()`
```
jQuery( '.scrollslider' ).scrollslider( 'goToCenterItem', item );
```

#### `scrollToCenterItem()`
```
jQuery( '.scrollslider' ).scrollslider( 'scrollToCenterItem', item [, default jQuery animation parameters] );
```

#### `goFor()`
```
jQuery( '.scrollslider' ).scrollslider( 'goFor', amount );
```

#### `scrollFor()`
```
jQuery( '.scrollslider' ).scrollslider( 'scrollFor', amount [, default jQuery animation parameters] );
```

#### `goToNextPage()`
```
jQuery( '.scrollslider' ).scrollslider( 'goToNextPage' );
```

#### `scrollToNextPage()`
```
jQuery( '.scrollslider' ).scrollslider( 'scrollToNextPage' [, default jQuery animation parameters] );
```

#### `goToPrevPage()`
```
jQuery( '.scrollslider' ).scrollslider( 'goToPrevPage' );
```

#### `scrollToPrevPage()`
```
jQuery( '.scrollslider' ).scrollslider( 'scrollToPrevPage' [, default jQuery animation parameters] );
```

#### `goToStart()`
```
jQuery( '.scrollslider' ).scrollslider( 'goToStart' );
```

#### `scrollToStart()`
```
jQuery( '.scrollslider' ).scrollslider( 'scrollToStart' [, default jQuery animation parameters] );
```

#### `goToEnd()`
```
jQuery( '.scrollslider' ).scrollslider( 'goToEnd' );
```

#### `scrollToEnd()`
```
jQuery( '.scrollslider' ).scrollslider( 'scrollToEnd' [, default jQuery animation parameters] );
```

#### `settings()`
```
jQuery( '.scrollslider' ).scrollslider( 'settings' );
```

#### `status()`
```
jQuery( '.scrollslider' ).scrollslider( 'status' );
```



## Configuration

While you [initialize](#initialization---init) the plugin, you can pass an options object.


### Default options
These options are used by default as fallback for missing configurations.
```
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
```


## Events

scrollslider-show, scrollslider-hide, scrollslider-shown, scrollslider-hidden