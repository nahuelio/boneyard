/**
*	SpinalJS Paragraph Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-basic-paragraph',

		p_simple: {
			$module: 'ui/basic/paragraph',
			$params: { content: 'Simple Text Content' }
		},

		p_html: {
			$module: 'ui/basic/paragraph',
			$params: { content: '<strong>HTML Content</strong>' }
		},

		$actions: [
			{ '$bone!cparagraph.addAll': [['$bone!p_simple', '$bone!p_html']] }
		]
	};

});
