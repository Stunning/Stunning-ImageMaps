(function(factory) {
	if(typeof define === 'function' && define.amd) {
		// AMD
		define(factory);
	} else if(typeof exports === 'object') {
		// Node/CommonJS
		module.exports = factory();
	} else {
		// Globals
		window.stunningImageMaps = factory();
	}
}(function() {
	'use strict';

	var svgElNS = "http://www.w3.org/2000/svg",
	svgAttNS = "http://www.w3.org/2000/xmlns/";

	var options = {
		inlineStyle: true,
		useImageParentAsWrap: false,
		classNames: {
			// Defaults to BEM style
			prefix: 'imgmap__',
			wrap: 'wrap',
			wrapIndividual: 'wrap--%',
			svg: 'svg',
			svgIndividual: 'svg--%',
			area: 'area',
			areaIndividual: 'area--%'
		},
		onClick: function(e) { }
	};

	var setup = function(opts) {
		if(typeof opts !== 'object') {
			return;
		}

		options = extendObject(options, opts);
	};

	var start = function( el ) {
		if( ! el) {
			el = findElements();
		} else if( !! el.tagName) {
			el = [el];
		}

		el.forEach(function(el) {
			var els = getElements( el );
			
			if(els === false) {
				return;
			}

			els.wrap = options.useImageParentAsWrap ? els.img.parentElement : createWrapElement( els.img );
			els.svg = createSVGElement( els );

			els.map.parentElement.removeChild( els.map );
		});
	};

	var findElements = function() {
		var el = document.querySelectorAll('img[usemap]');

		if( ! el.forEach ) {
			var arr = [];

			for(var i = 0; i < el.length; i++) {
				arr.push( el[i] );
			}

			el = arr;
		}

		return el;
	};

	// Get img and map elements by img or map element
	var getElements = function(el) {
		var els = {
			wrap: null,
			img: null,
			map: null,
			areas: null,
			svg: null
		};

		if( ! el.tagName ) {
			return false;
		}

		switch(el.tagName.toLowerCase()) {
			case 'map':
				els.map = el;

				if( ! el.getAttribute('name')) {
					return false;
				}

				els.img = document.querySelector('img[usemap="#' + el.getAttribute('name') + '"]');

				if( ! els.img.tagName) {
					return false;
				}
			break;

			case 'img':
				els.img = el;

				if( ! el.getAttribute('usemap')) {
					return false;
				}

				els.map = document.querySelector('map[name="' + el.getAttribute('usemap').substr(1) + '"]');

				if( ! els.map.tagName) {
					return false;
				}
			break;
		}

		if(options.inlineStyle) {
			els.img.style.verticalAlign = 'top';
		}

		els.areas = [];

		var areas = els.map.getElementsByTagName('area');

		if(areas.length) {
			for(var i = 0; i < areas.length; i++) {
				els.areas.push( areas[i] );
			}
		}

		return els;
	};

	var createWrapElement = function( img ) {
		// Create wrapper element
		var wrap = document.createElement('div');
		
		if(options.inlineStyle) {
			wrap.style.position = 'relative';
		}

		if(options.classNames) {
			wrap.setAttribute('class', buildClassName('wrap', img.getAttribute('usemap').substr( 1 )) );
		}
		
		// Insert wrapper before img
		img.parentElement.insertBefore( wrap, img );

		// Move img into wrapper
		wrap.appendChild( img );

		return wrap;
	};

	var createSVGElement = function( els ) {
		var svg = document.createElementNS( svgElNS, 'svg' );
		svg.setAttributeNS( svgAttNS, 'xmlns:xlink', 'http://www.w3.org/1999/xlink' );

		if(options.classNames) {
			svg.setAttribute('class', buildClassName('svg', els.img.getAttribute('usemap').substr( 1 )));
		}

		var tempimg = new Image();
		tempimg.onload = function() {
			svg.setAttribute('viewBox', '0 0 ' + this.width + ' ' + this.height);
			svg.setAttribute('width', this.width);
			svg.setAttribute('height', this.height);
		};
		tempimg.src = els.img.src;

		if(options.inlineStyle) {
			svg.style.position = 'absolute';
			svg.style.top = 0;
			svg.style.left = 0;
			svg.style.width = '100%';
			svg.style.height = '100%';
		}

		els.areas.forEach(function( area ) {
			var shape = createSVGChild( area );

			if(shape !== false) {
				svg.appendChild( shape );
			}
		});

		els.wrap.appendChild( svg );

		return svg;
	};

	var createSVGChild = function(area) {
		var child = null;
		var coords = area.getAttribute('coords');

		switch(area.getAttribute('shape').toLowerCase()) {
			case 'rect':
				coords = coords.split(',');

				child = document.createElementNS( svgElNS, 'rect' );
				child.setAttributeNS( null, 'x', coords[0] );
				child.setAttributeNS( null, 'y', coords[1] );
				child.setAttributeNS( null, 'width', coords[2] - coords[0] );
				child.setAttributeNS( null, 'height', coords[3] - coords[1] );
			break;

			case 'circle':
				coords = coords.split(',');

				child = document.createElementNS( svgElNS, 'circle' );
				child.setAttributeNS( null, 'cx', coords[0] );
				child.setAttributeNS( null, 'cy', coords[1] );
				child.setAttributeNS( null, 'r', coords[2] );
			break;

			case 'poly':
				coords = coords.replace(/(\d{1,},\d{1,})(?:,)/g, '$1 ');

				child = document.createElementNS( svgElNS, 'polygon' );
				child.setAttributeNS( null, 'points', coords );
			break;
		}

		if(child === null) {
			return false;
		}

		child.setAttributeNS( null, 'fill', '#000000' );
		child.setAttributeNS( null, 'stroke', 'none' );
		child.setAttributeNS( null, 'data-href', area.getAttribute('href') );
		child.setAttributeNS( null, 'class', buildClassName('area', area.parentElement.getAttribute('name')) );

		if(options.inlineStyle) {
			child.style.cursor = 'pointer';
		}

		child.onclick = clickSVGChild;

		return child;
	};

	var clickSVGChild = function(e) {
		var url = this.getAttribute('data-href');

		if(typeof options.onClick === 'function') {
			options.onClick.call( this, e );
		}

		if(url.substr(1) === '#') {
			window.location.hash = url;

			return;
		}

		window.location.href = url;
	};

	var buildClassName = function(type, usemap) {
		var str = options.classNames.prefix || '';

		str += options.classNames[ type ];

		if(options.classNames[ type + 'Individual' ]) {
			str += ' ' + (options.classNames.prefix || '');
			str += options.classNames[ type + 'Individual' ].replace('%', usemap);
		}

		return str;
	};

	var extendObject = function(destination, source) {
		for (var property in source) {
			if ( ! destination.hasOwnProperty(property)) {
				continue;
			}

			if (typeof source[property] === "object") {
				destination[property] = destination[property] || {};
				destination[property] = extendObject(destination[property], source[property]);
			} else {
				destination[property] = source[property];
			}
		}

		return destination;
	};

	return {
		setup: setup,
		toSVG: start
	};

}));