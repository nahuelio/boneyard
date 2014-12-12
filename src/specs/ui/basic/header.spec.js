/**
*	SpinalJS Heder Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-basic-header',

		h_1: {
			$module: 'ui/basic/header',
			$params: { id: 'h_1', content: 'This Header h1', heading: '1' }
		},

		h_2: {
			$module: 'ui/basic/header',
			$params: { id: 'h_2', content: 'This Header h2', heading: '2' }
		},

		h_3: {
			$module: 'ui/basic/header',
			$params: { id: 'h_3', content: 'This Header h3', heading: '3' }
		},

		h_4: {
			$module: 'ui/basic/header',
			$params: { id: 'h_4', content: 'This Header h4', heading: '4' }
		},

		h_5: {
			$module: 'ui/basic/header',
			$params: { id: 'h_5', content: 'This Header h5', heading: '5' }
		},

		$ready: [{
			'$bone!cheader.addAll': [[
			'$bone!h_1',
			'$bone!h_2',
			'$bone!h_3',
			'$bone!h_4',
			'$bone!h_5'
			], { renderOnAdd: true }]
		}]
	};

});
