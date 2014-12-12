/**
*	SpinalJS Paragraph Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-basic-paragraph',

		p_simple: {
			$module: 'ui/basic/paragraph',
			$params: { id: 'p_simple', content: 'Simple Text Content' }
		},

		p_html: {
			$module: 'ui/basic/paragraph',
			$params: { id: 'p_html', content: '<strong>HTML Content</strong>' }
		},

		$ready: [{
			'$bone!cparagraph.addAll': [[
				'$bone!p_simple',
				'$bone!p_html'
			], { renderOnAdd: true }]
		}]
	};

});
