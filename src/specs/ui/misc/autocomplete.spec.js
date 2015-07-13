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
			{ id: '1', content: 'Backbone', value: 'BackboneJS' },
			{ id: '2', content: 'EmberJS', value: 'EmberJS' },
			{ id: '3', content: 'React', value: 'React' },
			{ id: '4', content: 'PureMVC', value: 'PureMVC' }
		]),

		advanced_source: new Backbone.Collection([{
			id: '1',
			value: 'BackboneJS',
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
			value: 'React',
			content: {
				src: 'http://facebook.github.io/react/img/logo.svg',
				alt: 'React Logo',
				attrs: { width: 100, style: 'padding: 6px;' }
			}
		}, {
			id: '4',
			value: 'PureMVC',
			content: {
				src: 'http://puremvc.org/templates/js_element_blue/images/logo.png',
				alt: 'PureMVC Logo',
				attrs: { width: 100, style: 'padding: 6px;' }
			}
		}]),

		autocomplete_simple: {
			$module: 'ui/misc/autocomplete',
			$params: { collection: '$bone!simple_source', maxResults: 3 }
		},

		autocomplete_advanced: {
			$module: 'ui/misc/autocomplete',
			$params: { collection: '$bone!advanced_source', type: Image }
		},

		$ready: [{
			'$bone!auto_c_s.addAll': [['$bone!auto_p_s', '$bone!autocomplete_simple']],
			'$bone!auto_c_a.addAll': [['$bone!auto_p_a', '$bone!autocomplete_advanced']],
			'$bone!cautocomplete.addAll': [['$bone!auto_c_s', '$bone!auto_c_a'], { renderOnAdd: true }]
		}]

	};

});
