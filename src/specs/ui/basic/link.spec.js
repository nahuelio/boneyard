/**
*	SpinalJS Link Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-basic-link',

		l_simple: {
			$module: 'ui/basic/link',
			$params: { id: 'l_simple', content: 'This is a link', href: 'http://localhost:9393/index.html' }
		},

		$ready: [{
			'$bone!clink.addAll': [[
			'$bone!l_simple'
			], { renderOnAdd: true }]
		}]
	};

});
