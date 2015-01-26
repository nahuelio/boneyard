/**
*	SpinalJS List Component Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define(['ui/basic/image'], function(Image) {

	return {

		$id: 'ui-list-list',

		list_p_s: { $module: 'ui/basic/paragraph', $params: { content: '<code>Simple Styling</code>' } },
		list_p_a: { $module: 'ui/basic/paragraph', $params: { content: '<code>Advance Styling</code>' } },

		list_items_simple: new Backbone.Collection([
			{ content: 'Item 1' },
			{ content: 'Item 2' },
			{ content: 'Item 3' }
		]),

		list_items_advanced: new Backbone.Collection([{
			cls: 'backbone',
			content: {
				src: 'http://backbonejs.org/docs/images/backbone.png',
				alt: 'Backbone Logo',
				attrs: { width: 100, style: 'padding: 6px' }
			}
		}, {
			cls: 'emberjs',
			content: {
				src: 'http://www.gravatar.com/avatar/0cf15665a9146ba852bf042b0652780a?s=100',
				alt: 'EmberJS Logo',
				attrs: { width: 100, style: 'padding: 6px' }
			}
		}, {
			cls: 'react',
			content: {
				src: 'http://facebook.github.io/react/img/logo.svg',
				alt: 'React Logo',
				attrs: { width: 100, style: 'padding: 6px;' }
			}
		}, {
			cls: 'puremvc',
			content: {
				src: 'http://puremvc.org/templates/js_element_blue/images/logo.png',
				alt: 'PureMVC Logo',
				attrs: { width: 100, style: 'padding: 6px;' }
			}
		}]),

		list_simple: {
			$module: 'ui/list/list',
			$params: { cls: 'list-group', items: '$bone!list_items_advanced' }
		},

		list_advanced: {
			$module: 'ui/list/list',
			$params: { cls: 'list-group', items: '$bone!list_advanced', type: Image }
		},

		$ready: [{
			'$bone!clist.addAll': [[
				'$bone!list_p_s',
				'$bone!list_simple',
				'$bone!list_p_a',
				'$bone!list_advanced'
			], { renderOnAdd: true }]
		}]

	};

});
