/**
*	SpinalJS Dropdown Component Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define(['ui/basic/image'], function(Image) {

	return {

		$id: 'ui-misc-dropdown',

		dropdown_p_s: { $module: 'ui/basic/paragraph', $params: { content: '<code>Simple Styling</code>' } },
		dropdown_p_a: { $module: 'ui/basic/paragraph', $params: { content: '<code>Advanced Styling</code>' } },

		dropdown_items_simple: new Backbone.Collection([
			{ href: '#action1', content: 'Action 1' },
			{ href: '#action2', content: 'Action 2' },
			{ href: '#action3', content: 'Action 3' }
		]),

		dropdown_items_advanced: new Backbone.Collection([{
			cls: 'backbone',
			content: {
				src: 'http://backbonejs.org/docs/images/backbone.png',
				cls: 'btn btn-link',
				alt: 'Backbone Logo',
				attrs: { height: 30 }
			}
		}, {
			cls: 'emberjs',
			content: {
				src: 'http://www.gravatar.com/avatar/0cf15665a9146ba852bf042b0652780a?s=100',
				cls: 'btn btn-link',
				alt: 'EmberJS Logo',
				attrs: { height: 30 }
			}
		}, {
			cls: 'react',
			content: {
				src: 'http://facebook.github.io/react/img/logo.svg',
				cls: 'btn btn-link',
				alt: 'React Logo',
				attrs: { height: 30 }
			}
		}, {
			cls: 'puremvc',
			content: {
				src: 'http://puremvc.org/templates/js_element_blue/images/logo.png',
				cls: 'btn btn-link',
				alt: 'PureMVC Logo',
				attrs: { height: 30 }
			}
		}]),

		dropdown_simple: {
			$module: 'ui/misc/dropdown',
			$params: { collection: '$bone!dropdown_items_simple' }
		},

		dropdown_advanced: {
			$module: 'ui/misc/dropdown',
			$params: { text: 'Advanced', collection: '$bone!dropdown_items_advanced', type: Image }
		},

		$actions: [
			{ '$bone!cdropdown.addAll': [[
				'$bone!dropdown_p_s',
				'$bone!dropdown_simple',
				'$bone!dropdown_p_a',
				'$bone!dropdown_advanced'
			]]
		}]

	};

});
