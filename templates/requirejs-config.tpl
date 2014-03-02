/**
*	RequireJS Config
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
require.config({
	
	paths: {
		lib: 'lib/libraries',
		<% for(var i = 0; i < mods.length; i++) { %>
			<%= mods[i].ns : mods[i].target %><% if(i != (mods.length-1)) { %>,<% } %>
		<% } %>
	},
	
	shim: {
		<% for(var j = 0; j < libs.length; j++) { %>
			'<%= libs[j].ns %>': [<%= libs[j].deps %>]
		<% } %>
	}
	
});