/**
*	SpinalJS Dialog Component Spec
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*/
define([], function() {

	return {

		$id: 'ui-misc-dialog',

		dialog_c_s: { $module: 'ui/container', $params: { className: 'form-group' } },
		dialog_p_s: { $module: 'ui/basic/paragraph', $params: { content: '<code>Simple Dialog</code>' } },
		dialog_b_s: {
			$module: 'ui/form/controls/button',
			$params: { text: 'Simple Modal', type: 'btn-primary', attrs: { 'data-toggle': 'modal', 'data-target': '#dialog-simple' } }
		},

		dialog_c_a: { $module: 'ui/container', $params: { className: 'form-group' } },
		dialog_p_a: { $module: 'ui/basic/paragraph', $params: { content: '<code>Advanced Dialog</code>' } },
		dialog_b_a: {
			$module: 'ui/form/controls/button',
			$params: { text: 'Advanced Modal', type: 'btn-primary', attrs: { 'data-toggle': 'modal', 'data-target': '#dialog_advanced' } }
		},

		dialog_default_buttons: [
			{ text: 'Confirm', type: 'btn-primary' },
			{ text: 'Cancel', attrs: { 'data-dismiss': 'modal' } }
		],

		dialog_content_s: {
			$module: 'ui/basic/paragraph',
			$params: { content: '<code>This is my simple dialog content.</code>' }
		},

		dialog_list_simple: {
			$module: 'ui/list/list',
			$params: { cls: 'list-group', collection: '$bone!list_items_simple' }
		},

		dialog_simple: {
			$module: 'ui/misc/dialog',
			$params: { id: 'dialog-simple', title: 'Simple Dialog', footer: '$bone!dialog_default_buttons' }
		},

		dialog_advanced: {
			$module: 'ui/misc/dialog',
			$params: { id: 'dialog_advanced', title: 'Advanced Dialog', closeIcon: false, footer: '$bone!dialog_default_buttons' }
		},

		$actions: [
			{ '$bone!dialog_c_s.addAll': [['$bone!dialog_p_s', '$bone!dialog_b_s', '$bone!dialog_simple']] },
			{ '$bone!dialog_c_a.addAll': [['$bone!dialog_p_a', '$bone!dialog_b_a', '$bone!dialog_advanced']] },
			{ '$bone!dialog_simple.add': ['$bone!dialog_content_s'] },
			{ '$bone!dialog_advanced.add': ['$bone!dialog_list_simple'] },
			{ '$bone!cdialog.addAll': [['$bone!dialog_c_s', '$bone!dialog_c_a']] }
		]

	};

});
