/**
*	SpinalJS Textarea Component Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-form-controls-textarea',

		textarea: {
			$module: 'ui/form/controls/textarea',
			$params: { name: 'textarea', placeholder: 'Default Text' }
		},

		$actions: [
			{ '$bone!ctextarea.addAll': [['$bone!textarea']] },
			{ '$bone!textarea.addClass': ['form-control'] }
		]

	};

});
