/**
*	SpinalJS Span Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-basic-span',

		s_glyph: {
			$module: 'ui/basic/span',
			$params: { }
		},

		s_simple: {
			$module: 'ui/basic/span',
			$params: { content: 'Simple Span Text content' }
		},

		$ready: [{
			'$bone!cspan.addAll': [[
				'$bone!s_glyph',
				'$bone!s_simple'
			], { renderOnAdd: true }],
			'$bone!s_glyph.addClass': ['glyphicon glyphicon-search']
		}]
	};

});
