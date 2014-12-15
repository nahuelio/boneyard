/**
*	SpinalJS Table Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-table',

		table_header: {
			$module: 'ui/basic/header',
			$params: {
				id: 'table_header',
				content: 'Table <small><kbd>com.spinal.ui.table</kbd></small>',
				heading: '2'
			}
		},

		ctable: {
			$module: 'ui/misc/panel',
			$params: { id: 'ui-table-table', title: 'Table' }
		},

		$ready: [{
			'$bone!global.addAll': [[
				'$bone!table_header',
				'$bone!ctable'
			], { renderOnAdd: true }]
		}]

	};

});
