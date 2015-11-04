/**
*	Boneyard Table Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define(['specs/ui/table/table.spec'], function(TableSpec) {

	return {

		$id: 'ui-table',
		$specs: [TableSpec],

		table_header: {
			$module: 'ui/basic/header',
			$params: {
				content: 'Table <small><kbd>com.boneyard.ui.table</kbd></small>',
				heading: '2'
			}
		},

		ctable: {
			$module: 'ui/misc/panel',
			$params: { id: 'table', title: 'Table' }
		},

		$actions: [{
			'$bone!global.addAll': [[
				'$bone!table_header',
				'$bone!ctable'
			]]
		}]

	};

});
