/**
*	SpinalJS Image Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-basic-image',

		svg_image: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgdmlld0JveD0iMCAwIDE0MCAxNDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjxkZWZzLz48cmVjdCB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgZmlsbD0iI0VFRUVFRSIvPjxnPjx0ZXh0IHg9IjQ0LjA0Njg3NSIgeT0iNzAiIHN0eWxlPSJmaWxsOiNBQUFBQUE7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LWZhbWlseTpBcmlhbCwgSGVsdmV0aWNhLCBPcGVuIFNhbnMsIHNhbnMtc2VyaWYsIG1vbm9zcGFjZTtmb250LXNpemU6MTBwdDtkb21pbmFudC1iYXNlbGluZTpjZW50cmFsIj4xNDB4MTQwPC90ZXh0PjwvZz48L3N2Zz4=',

		i_simple: {
			$module: 'ui/basic/image',
			$params: { src: 'http://backbonejs.org/docs/images/backbone.png', alt: 'Backbone Logo', attrs: { width: '100%', style: 'margin: 10px 0;' } }
		},

		i_ph_rounded: {
			$module: 'ui/basic/image',
			$params: { src: '$bone!svg_image', attrs: { width: 140, style: 'display: block; margin: 10px 0;' } }
		},

		i_ph_circled: {
			$module: 'ui/basic/image',
			$params: { src: '$bone!svg_image', attrs: { width: 140, style: 'display: block; margin: 10px 0;' } }
		},

		i_ph_thumbnailed: {
			$module: 'ui/basic/image',
			$params: { src: '$bone!svg_image', attrs: { width: 140, style: 'display: block; margin: 10px 0;' } }
		},

		$actions: [
			{ '$bone!cimage.addAll': [['$bone!i_simple', '$bone!i_ph_rounded', '$bone!i_ph_circled', '$bone!i_ph_thumbnailed' ], { renderOnAdd: true }] },
			{ '$bone!i_ph_rounded.addClass': ['img-rounded'] },
			{ '$bone!i_ph_circled.addClass': ['img-circle'] },
			{ '$bone!i_ph_thumbnailed.addClass': ['img-thumbnail'] }
		]
	};

});
