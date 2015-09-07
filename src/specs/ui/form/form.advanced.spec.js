/**
*	SpinalJS Form Advanced Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-form-advanced',

		form_l_a: { $module: 'ui/basic/paragraph', $params: { content: '<code>Advanced Form</code>' } },

		advanced_model: [{ id: 1 }, { id: 2 }],

		form_advanced_collection: new Backbone.Collection([]),

		form_advanced: {
			$module: 'ui/form/form',
			$params: {
				name: 'form_advanced',
				action: 'http:/localhost:9393/',
				collection: '$bone!form_advanced_collection'
			}
		},

		$ready: [{
			'$bone!cform.addAll': [[
				'$bone!form_l_a',
				'$bone!form_advanced'
			], { renderOnAdd: true }]
		}, {
			'$bone!form_advanced_collection.reset': ['$bone!advanced_model']
		}]

	};

});
