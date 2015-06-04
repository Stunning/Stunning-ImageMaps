# Stunning ImageMaps
Converts HTML image maps to SVG equivalents.

## Background
The initial reason for this plugin was to fix the image maps click problem in iOS8. But under the way I realized the plugin also could fix the responsive problem at the same time.

## Installation
The plugin supports ”globals”, AMD and CommonJS. Install with `bower install stunning-imagemaps` or `npm install stunning-imagemaps`.

## Initialize

#### Globals
The plugin is available in the `window` object as `window.stunningImageMaps`, so it's available to use like this:


```
stunningImageMaps.toSVG();
```

#### jQuery
Get “the real“ element when using in a jQuery environment.

```
stunningImageMaps.toSVG( $('map#imgmap').get(0) );
```

#### Browserify (CommonJS)
```
var stunningImageMaps = require('stunning-imagemaps');

stunningImageMaps.toSVG();
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

```
// Change default options
.setup( options );

// Convert specific or all imagemaps to SVG, by giving either the img or map element.
.toSVG( [nothing for all, element or elements for specific] )
```
