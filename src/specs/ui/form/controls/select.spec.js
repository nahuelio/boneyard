/**
*	SpinalJS Select Component Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-form-controls-select',

		sel_simple: {
			$module: 'ui/form/controls/select',
			$params: {
				id: 'sel_simple',
				name: 'sel_simple',
				options: [
					{ id: 'sel_simple_op_1', text: 'Option 1', value: '1' },
					{ id: 'sel_simple_op_2', text: 'Option 2', value: '2' },
					{ id: 'sel_simple_op_3', text: 'Option 3', value: '3' }
				]
			}
		},

		$ready: [{
			'$bone!cselect.add': ['$bone!sel_simple', { renderOnAdd: true }],
			'$bone!sel_simple.addClass': ['form-control']
		}]

	};

});
