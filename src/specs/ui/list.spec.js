/**
*	SpinalJS List Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-list',

		list_header: {
			$module: 'ui/basic/header',
			$params: {
				id: 'list_header',
				content: 'List <small><kbd>com.spinal.ui.list</kbd></small>',
				heading: '2'
			}
		},

		clist: {
			$module: 'ui/misc/panel',
			$params: { id: 'ui-list-list', title: 'List' }
		},

		$ready: [{
			'$bone!global.addAll': [[
				'$bone!list_header',
				'$bone!clist'
			], { renderOnAdd: true }]
		}]

	};

});
