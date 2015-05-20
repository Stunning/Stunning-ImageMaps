# Stunning ImageMaps
Replaces HTML Image maps with a SVG equivalent.

## Background
The initial reason for this plugin was to fix the image maps click problem in iOS8. But under the way I realized the plugin also could fix the responsive problem at the same time.

## How to install
The plugin supports ”globals”, AMD and CommonJS. Install with `bower install stunning-imagemaps` or `npm install stunning-imagemaps`.

## How to use

#### Globals
The plugin is available in the `window` object as `window.stunningImageMaps`, so just use like this:


```
stunningImageMaps.run();
```

#### jQuery
Get “the real“ element when using in a jQuery environment.

```
stunningImageMaps.run( $('map#imgmap').get(0) );
```

#### Browserify (CommonJS)
```
var stunningImageMaps = require('stunning-imagemaps');

stunningImageMaps.run();
```
## Options
The options object and their default setting.

```
.setup({
	inlineStyle: true	 			// Create inline styles or not
	useImageParentAsWrap: false,	// Will create wrap element if false
	classNames: {					// Class names
		prefix: 'imgmap__', 		// Prefix
		wrap: 'wrap',				// Wrap elements
		wrapIndividual: 'wrap--%',	// Individual wrap elements, % will be changed to map name attribute
		svg: 'svg',					// SVG elements
		svgIndividual: 'svg--%'	,	// Individual SVG elements, % will be changed to map name attribute
		area: 'area',				// Area elements
		areaIndividual: 'area--%'	// Individual area elements, % will be changed to map name attribute
	},
	onClick: function(e) { }		// Will be called when clicking area shape
});
```
## Methods
Available methods:

```
// Change default options
.setup( options );

// Change specific imagemaps to SVG,
// either the img or map element.
.run( [nothing for all, element or elements for specific] )
```