# scrollslider

A simple slider for any HTML contents.

> **Mhh... why I believe this slider is indispensable?**<br/>
> *Well, it doesn't touch your markup, and it's based on the scrolling position of the main element.*


## Example

Hey, just [visit the github page about this plugin](http://bukfixart.github.com/jQuery-scrollslider/), to see it in action.

## Usage

### Markup
```
<ul>
    <li>item 1</li>
    <li>item 2</li>
    …
</ul>
```
### Methods

#### Initialization - `init()`
```
jQuery( 'ul' ).scrollslider( [ options ] );
```
Initializes the plugin with the given [options](#default-options) which are explained below.
The [options](#default-options) are optional ;-) so you haven't to configure them.


#### `goTo()`
```
jQuery( 'ul' ).scrollslider( 'goTo', pos );
```

#### `scrollTo()`
```
jQuery( 'ul' ).scrollslider( 'scrollTo', pos [, default jQuery animation parameters] );
```

#### `goToItem()`
```
jQuery( 'ul' ).scrollslider( 'goToItem', item );
```

#### `scrollToItem()`
```
jQuery( 'ul' ).scrollslider( 'scrollToItem', item [, default jQuery animation parameters] );
```

#### `goToCenterItem()`
```
jQuery( 'ul' ).scrollslider( 'goToCenterItem', item );
```

#### `scrollToCenterItem()`
```
jQuery( 'ul' ).scrollslider( 'scrollToCenterItem', item [, default jQuery animation parameters] );
```

#### `goFor()`
```
jQuery( 'ul' ).scrollslider( 'goFor', amount );
```

#### `scrollFor()`
```
jQuery( 'ul' ).scrollslider( 'scrollFor', amount [, default jQuery animation parameters] );
```

#### `goToNextPage()`
```
jQuery( 'ul' ).scrollslider( 'goToNextPage' );
```

#### `scrollToNextPage()`
```
jQuery( 'ul' ).scrollslider( 'scrollToNextPage' [, default jQuery animation parameters] );
```

#### `goToPrevPage()`
```
jQuery( 'ul' ).scrollslider( 'goToPrevPage' );
```

#### `scrollToPrevPage()`
```
jQuery( 'ul' ).scrollslider( 'scrollToPrevPage' [, default jQuery animation parameters] );
```

#### `goToStart()`
```
jQuery( 'ul' ).scrollslider( 'goToStart' );
```

#### `scrollToStart()`
```
jQuery( 'ul' ).scrollslider( 'scrollToStart' [, default jQuery animation parameters] );
```

#### `goToEnd()`
```
jQuery( 'ul' ).scrollslider( 'goToEnd' );
```

#### `scrollToEnd()`
```
jQuery( 'ul' ).scrollslider( 'scrollToEnd' [, default jQuery animation parameters] );
```

#### `settings()`
```
jQuery( 'ul' ).scrollslider( 'settings' );
```

#### `status()`
```
jQuery( 'ul' ).scrollslider( 'status' );
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

Currently there are some basic words about events on the [project's github page](http://bukfixart.github.com/jQuery-scrollslider/#events)