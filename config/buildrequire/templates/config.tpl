/**
*	RequireJS Config
*	@author <%= author %>
**/
require.config({
	
	paths: {
		lib: 'lib/libraries',
		<% for(var i = 0; i < mods.length; i++) { %>
			<%= mods[i].path %>: '<%= mods[i].target %>'<% if(i != (mods.length-1)) { %>,<% } %>
		<% } %>
	},
	
	shim: {
		<% for(var j = 0; j < libs.length; j++) { %>
			'lib/<%= libs[j].path %>': [<%= libs[j].deps %>]<% if(j != (libs.length-1)) { %>,<% } %>
		<% } %>
	}
	
});