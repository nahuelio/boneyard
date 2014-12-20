/**
*	SpinalJS List Component Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-list-list',

		list_p_s: { $module: 'ui/basic/paragraph', $params: { content: '<code>Simple Styling</code>' } },

		list_items: [
			{ item: 'Item 1' },
			{ item: 'Item 2' },
			{ item: 'Item 3' }
		],

		list_simple: {
			$module: 'ui/list/list',
			$params: { items: '$bone!list_items' }
		},

		$ready: [{
			'$bone!clist.addAll': [[
				'$bone!list_p_s',
				'$bone!list_simple'
			], { renderOnAdd: true }],
			'$bone!list_simple.addClass': ['table-hover']
		}]

	};

});
