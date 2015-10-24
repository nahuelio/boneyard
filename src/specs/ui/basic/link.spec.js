/**
*	SpinalJS Link Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-basic-link',

		l_simple: {
			$module: 'ui/basic/link',
			$params: { content: 'This is a link', href: 'http://localhost:9393/index.html' }
		},

		$actions: [{
			'$bone!clink.addAll': [[
			'$bone!l_simple'
			], { renderOnAdd: true }]
		}]
	};

});
