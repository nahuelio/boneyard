/**
*	SpinalJS List Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define(['specs/ui/list/list.spec'], function(ListSpec) {

	return {

		$id: 'ui-list',
		$specs: [ListSpec],

		list_header: {
			$module: 'ui/basic/header',
			$params: {
				content: 'List <small><kbd>com.spinal.ui.list</kbd></small>',
				heading: '2'
			}
		},

		clist: {
			$module: 'ui/misc/panel',
			$params: { id: 'list', title: 'List' }
		},

		$actions: [{
			'$bone!global.addAll': [[
				'$bone!list_header',
				'$bone!clist'
			], { renderOnAdd: true }]
		}]

	};

});
