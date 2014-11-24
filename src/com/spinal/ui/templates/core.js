/**
*	@module com.spinal.ui.templates
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ui/templates/head',
		'ui/templates/basic',
		'ui/templates/list',
		'ui/templates/table',
		'ui/templates/input',
		'ui/templates/misc'], function(Head, Basic, List, Table, Input, Misc) {

	// FIXME: Use categories for namespacing
	return Spinal.namespace('templates', _.exend({}, arguments));

});
