/**
*	SpinalJS Dropdown Component Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-misc-dropdown',

		dropdown_items: [
			{ className: '', template: '<a href="#">Action 1</a>' },
			{ className: '', template: '<a href="#">Action 2</a>' },
			{ className: '', template: '<a href="#">Action 3</a>' }
		],

		dropdown: {
			$module: 'ui/misc/dropdown',
			$params: { text: 'Dropdown', items: '$bone!dropdown_items' }
		},

		$ready: [
			{ '$bone!cdropdown.add': ['$bone!dropdown', { renderOnAdd: true }] }
		]

	};

});
