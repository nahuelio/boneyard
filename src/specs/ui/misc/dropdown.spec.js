/**
*	SpinalJS Dropdown Component Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-misc-dropdown',

		dropdown_items: new Backbone.Collection([
			{ template: '<a href="#">Action 1</a>' },
			{ template: '<a href="#">Action 2</a>' },
			{ template: '<a href="#">Action 3</a>' }
		]),

		dropdown: {
			$module: 'ui/misc/dropdown',
			$params: { text: 'Dropdown', collection: '$bone!dropdown_items' }
		},

		$ready: [
			{ '$bone!cdropdown.add': ['$bone!dropdown', { renderOnAdd: true }] }
		]

	};

});
