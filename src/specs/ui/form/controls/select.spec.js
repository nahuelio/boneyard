/**
*	Boneyard Select Component Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-form-controls-select',

		sel_simple: {
			$module: 'ui/form/controls/select',
			$params: {
				name: 'sel_simple',
				options: [
					{ text: 'Option 1', value: '1' },
					{ text: 'Option 2', value: '2' },
					{ text: 'Option 3', value: '3' }
				]
			}
		},

		$actions: [
			{ '$bone!cselect.add': ['$bone!sel_simple'] },
			{ '$bone!sel_simple.addClass': ['form-control'] }
		]

	};

});
