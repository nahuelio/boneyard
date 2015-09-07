/**
*	SpinalJS Form Simple Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-form-simple',

		form_l_s: { $module: 'ui/basic/paragraph', $params: { content: '<code>Simple Form</code>' } },

		form_simple: {
			$module: 'ui/form/form',
			$params: {
				name: 'form_simple',
				action: 'http:/localhost:9393/'
			}
		},

		$ready: [{
			'$bone!cform.addAll': [[
				'$bone!form_l_s',
				'$bone!form_simple'
			], { renderOnAdd: true }]
		}]

	};

});
