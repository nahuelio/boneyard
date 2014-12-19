define(['core/spinal'], function(Spinal) { return Spinal.namespace('templates', {
	"spinal": {
		"basic": {
			"a": "<a href=\"<%= _$.href %>\"\n\t<%= (_$.id) ? \"id=\\\"\" + _$.id + \"\\\"\" : \"\" %>\n\t<%= (_$.cls) ? \"class=\\\"\" + _$.cls + \"\\\"\" : \"\" %>\n\t<%= (_$.target) ? \"target=\\\"\" + _$.target + \"\\\"\" : \"\" %>\n\t<%= (_$.rel) ? \"rel=\\\"\" + _$.rel + \"\\\"\" : \"\" %>><%= _$.text %></a>\n",
			"div": "<div <%= (_$.id) ? \"id=\\\"\" + _$.id + \"\\\"\" : \"\" %>\n\t<%= (_$.cls) ? \"class=\\\"\" + _$.cls + \"\\\"\" : \"\" %>></div>\n",
			"fieldset": "<fieldset id=\"<%= (_$.id) ? _$.id : '' %>\" class=\"<%= (_$.cls) ? _$.cls : '' %>\"></fieldset>\n",
			"form": "<form id=\"<%= (_$.id) ? _$.id : '' %>\"\n\tclass=\"<%= (_$.cls) ? _$.cls : '' %>\"\n\taction=\"<%= (_$.action) ? _$.action : '' %>\"\n\tmethod=\"<%= (_$.method) ? _$.method : '' %>\">\n</form>\n",
			"h": "<h<%= _$.w %> id=\"<%= (_$.id) ? _$.id : '' %>\" class=\"<%= (_$.cls) ? _$.cls : '' %>\"></h<%= _$.w %>>\n",
			"label": "<label id=\"<%= (_$.id) ? _$.id : \"\" %>\"\n\tclass=\"<%= (_$.cls) ? _$.cls : \"\" %>\"\n\t<%= (_$._for) ? \"for=\\\"\" + _$._for + \"\\\"\" : \"\" %>>\n</label>\n",
			"p": "<p id=\"<%= (_$.id) ? _$.id : \"\" %>\" class=\"<%= (_$.cls) ? _$.cls : \"\" %>\"></p>\n",
			"panel": "<div class=\"panel-heading\"></div><div class=\"panel-body\"></div>\n",
			"span": "<span id=\"<%= (_$.id) ? _$.id : \"\" %>\" class=\"<%= (_$.cls) ? _$.cls : \"\" %>\"></span>\n",
			"table": "<table <%= (_$.id) ? \"id=\\\"\" + _$.id + \"\\\"\" : \"\" %>\n\t<%= (_$.cls) ? \"class=\\\"\" + _$.cls + \"\\\"\" : \"\" %>\n\t<%= (_$.attrs) ? _$.attrs  : \"\" %>></table>\n"
		},
		"head": {
			"link": "<link rel=\"<%= _$.type %>\" href=\"<%= _$.href %>\" />\n",
			"script": "<script type=\"<%= _$.type %>\" src=\"<%= _$.src %>\"></script>\n"
		},
		"input": {
			"button": "<button <%= (_$.id) ? \"id=\\\"\" + _$.id + \"\\\"\" : \"\" %>\n\t<%= (_$.cls) ? \"class=\\\"\" + _$.cls + \"\\\"\" : \"\" %>><%= _$.text %></button>\n",
			"input": "<input type=\"<%= _$.type %>\" id=\"<%= _$.id %>\" name=\"<%= _$.name %>\"\n\t<%= (_$.cls) ? \"class=\\\"\" + _$.cls + \"\\\"\" : \"\" %>\n\t<%= (_$.attrs) ? _$.attrs  : \"\" %>/>\n",
			"option": "<option value=\"<%= _$.value %>\"><%= _$.text %></option>\n",
			"select": "<select id=\"<%= _$.id %>\"\n\t<%= (_$.cls) ? \"class=\\\"\" + _$.cls + \"\\\"\" : \"\" %>>\n\t<%= (_$.options) ? _$.options : \"\" %>\n</select>\n",
			"textarea": "<textarea <%= (_$.id) ? \"id=\\\"\" + _$.id + \"\\\"\" : \"\" %> \n\t<%= (_$.cls) ? \"class=\\\"\" + _$.cls + \"\\\"\" : \"\" %>\n\t<%= (_$.attrs) ? _$.attrs  : \"\" %>>\n</textarea>\n"
		},
		"list": {
			"li": "<li id=\"<%= (_$.id) ? _$.id : '' %>\" class=\"<%= (_$.cls) ? _$.cls : '' %>\"></li>\n",
			"ul": "<ul id=\"<%= (_$.id) ? _$.id : '' %>\" class=\"<%= (_$.cls) ? _$.cls : '' %>\"></ul>\n"
		},
		"misc": {
			"abbr": "<abbr></abbr>\n",
			"address": "<address></address>\n",
			"article": "<article></article>\n",
			"cite": "<cite></cite>\n",
			"hr": "<hr/>\n",
			"img": "<img />\n"
		},
		"table": {
			"caption": "<caption><%= _$.text %></caption>\n",
			"t": "<t<%= _$.t %> <%= (_$.id) ? \"id=\\\"\" + _$.id + \"\\\"\" : \"\" %>\n\t<%= (_$.cls) ? \"class=\\\"\" + _$.cls + \"\\\"\" : \"\" %>\n\t<%= (_$.attrs) ? _$.attrs  : \"\" %>>\n</t<%= _$.t %>>\n",
			"ts": "<t<%= _$.type %> <%= (_$.id) ? \"id=\\\"\" + _$.id + \"\\\"\" : \"\" %>\n\t<%= (_$.cls) ? \"class=\\\"\" + _$.cls + \"\\\"\" : \"\" %>\n\t<%= (_$.attrs) ? _$.attrs  : \"\" %>>\n\t<% if(_$.trs) { for(var tr in _$.trs) { var t = (typeof(_$.trs[tr]) !== 'undefined') ? _$.trs[tr] : {}; %>\n\t\t<tr <%= (t.id) ? \"id=\\\"\" + t.id + \"\\\"\" : \"\" %>\n\t\t\t<%= (t.cls) ? \"class=\\\"\" + t.cls + \"\\\"\" : \"\" %>\n\t\t\t<%= (t.attrs) ? t.attrs  : \"\" %>>\n\t\t</tr>\n\t<% } } %>\n</t<%= _$.type %>>\n"
		}
	}
}); });