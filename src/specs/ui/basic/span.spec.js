/**
*	SpinalJS Span Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-basic-span',

		s_glyph: {
			$module: 'ui/basic/span',
			$params: { attrs: { style: 'margin: 0 10px;' } }
		},

		s_simple: {
			$module: 'ui/basic/span',
			$params: { content: 'Simple Span Text content' }
		},

		$actions: [
			{ '$bone!cspan.addAll': [['$bone!s_glyph', '$bone!s_simple' ], { renderOnAdd: true }] },
			{ '$bone!s_glyph.addClass': ['glyphicon glyphicon-search'] }
		]
	};

});
