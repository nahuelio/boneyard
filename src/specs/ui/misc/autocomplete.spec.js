/**
*	SpinalJS Autocomplete Component Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ui/basic/image'], function(Image) {

	return {

		$id: 'ui-misc-autocomplete',

		auto_c_s: { $module: 'ui/container', $params: { className: 'form-group' } },
		auto_p_s: { $module: 'ui/basic/paragraph', $params: { content: '<code>Simple Autocomplete</code>' } },

		auto_c_a: { $module: 'ui/container', $params: { className: 'form-group' } },
		auto_p_a: { $module: 'ui/basic/paragraph', $params: { content: '<code>Advanced Autocomplete</code>' } },

		simple_source: new Backbone.Collection([
			{ id: '1', value: 'A term' },
			{ id: '2', value: 'C term' },
			{ id: '3', value: 'B term' },
			{ id: '4', value: 'D term' },
			{ id: '5', value: 'E term' }
		]),

		advanced_source: new Backbone.Collection([{
			id: '1',
			value: 'Backbone',
			content: {
				src: 'http://backbonejs.org/docs/images/backbone.png',
				alt: 'Backbone Logo',
				attrs: { width: 100, style: 'padding: 6px' }
			}
		}, {
			id: '2',
			value: 'EmberJS',
			content: {
				src: 'http://www.gravatar.com/avatar/0cf15665a9146ba852bf042b0652780a?s=100',
				alt: 'EmberJS Logo',
				attrs: { width: 100, style: 'padding: 6px' }
			}
		}, {
			id: '3',
			value: 'AngularJS',
			content: {
				src: 'https://angularjs.org/img/AngularJS-large.png',
				alt: 'AngularJS Logo',
				attrs: { width: 100, style: 'padding: 6px' }
			}
		}]),

		autocomplete_simple: {
			$module: 'ui/misc/autocomplete',
			$params: { collection: '$bone!simple_source', delay: 2, maxResults: 3 }
		},

		autocomplete_advanced: {
			$module: 'ui/misc/autocomplete',
			$params: { collection: '$bone!advanced_source', resultType: Image }
		},

		$ready: [{
			'$bone!auto_c_s.addAll': [['$bone!auto_p_s', '$bone!autocomplete_simple']],
			'$bone!auto_c_a.addAll': [['$bone!auto_p_a', '$bone!autocomplete_advanced']],
			'$bone!cautocomplete.addAll': [['$bone!auto_c_s', '$bone!auto_c_a'], { renderOnAdd: true }]
		}]

	};

});
