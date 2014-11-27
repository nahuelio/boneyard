/**
*	Main Composer Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui',

		theme: 'standard',

		global: {
			$module: 'ui/container',
			$params: { el: 'div#global' }
		},

		components: {
			$module: 'ui/container',
			$params: { id: 'components', theme: '$bone!theme' }
		},

		$ready: [
			{ '$bone!global.add': ['$bone!components', { renderOnAdd: true }] }
		]

	};

});
