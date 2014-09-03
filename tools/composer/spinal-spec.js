/**
*	Main Composer Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		theme: 'standard',

		global: {
			$module: {
				class: 'ui/container',
				params: { el: 'div#global' }
			},
			$ready: [
				{ add: ['$bone!components', { renderOnAdd: true }] }
			]
		},

		components: {
			$module: {
				class: 'ui/container',
				params: { id: 'components' }
			}
		}

	};

});
