/**
*	Boneyard Heder Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-basic-header',

		h_1: {
			$module: 'ui/basic/header',
			$params: { content: 'Header h1', heading: '1' }
		},

		h_2: {
			$module: 'ui/basic/header',
			$params: { content: 'Header h2', heading: '2' }
		},

		h_3: {
			$module: 'ui/basic/header',
			$params: { content: 'Header h3', heading: '3' }
		},

		h_4: {
			$module: 'ui/basic/header',
			$params: { content: 'Header h4', heading: '4' }
		},

		h_5: {
			$module: 'ui/basic/header',
			$params: { content: 'Header h5', heading: '5' }
		},

		$actions: [{
			'$bone!cheader.addAll': [[
				'$bone!h_1',
				'$bone!h_2',
				'$bone!h_3',
				'$bone!h_4',
				'$bone!h_5'
			]]
		}]
	};

});
