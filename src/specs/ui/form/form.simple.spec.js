/**
*	SpinalJS Form Simple Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-form-simple',

		form_l_s: { $module: 'ui/basic/paragraph', $params: { content: '<code>Simple Form</code>' } },

		simple_model: [{ id: 1 }, { id: 2 }],

		form_simple_collection: new Backbone.Collection([]),

		form_simple: {
			$module: 'ui/form/form',
			$params: {
				name: 'form_simple',
				action: 'http:/localhost:9393/',
				collection: '$bone!form_simple_collection'
			}
		},

		$ready: [{
			'$bone!cform.addAll': [[
				'$bone!form_l_s',
				'$bone!form_simple'
			], { renderOnAdd: true }]
		}, {
			'$bone!form_simple_collection.reset': ['$bone!simple_model']
		}]

	};

});
