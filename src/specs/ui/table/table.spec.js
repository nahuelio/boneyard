/**
*	SpinalJS Table Component Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-table-table',

		table_columns: ['Column A', 'Column B', 'Column C'],

		table_rows: [
			['Row 1.A', { content: 'Row 1.B' }, { content: 'Row 1.C' }],
			['Row 2.A', { content: 'Row 2.B', cls: 'middle-one' }, 'Row 2.C'],
			[{ content: 'Row 3.A' }, { content: 'Row 3.B' }, 'Row 3.C']
		],

		table_footer: [
			[{ content: 'Footer A', cls: 'footer-row-A' }, 'Footer B', { content: 'Footer C', cls: 'footer-row-C' }]
		],

		table_container: {
			$module: 'ui/table/table',
			$params: {
				id: 'table_container',
				columns: '$bone!table_columns',
				rows: '$bone!table_rows',
				footer: '$bone!table_footer'
			}
		},

		$ready: [{
			'$bone!ctable.add': ['$bone!table_container', { renderOnAdd: true }],
			'$bone!table_container.addClass': ['table-striped']
		}]

	};

});
