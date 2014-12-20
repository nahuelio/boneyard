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

		$ready: [{
			'$bone!ctextarea.addAll': [[
				'$bone!textarea'
			], { renderOnAdd: true }],
			'$bone!textarea.addClass': ['form-control']
		}]

	};

});
