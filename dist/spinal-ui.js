//	SpinalJS Ui@0.0.1 (c) 2014 Patricio Ferreira <3dimentionar@gmail.com>, 3dimention.com
//	SpinalJS may be freely distributed under the MIT license.
//	For all details and documentation: http://3dimention.github.io/spinal
define("ui/view",["core/spinal","util/string","util/exception/ui","templates/spinal","libs/bootstrap"],function(e,t,n){var r=e.namespace("com.spinal.ui.View",e.Backbone.View.inherit({id:null,events:{},className:"ui-view",method:"append",_parent:null,_theme:null,_tpl:null,constructor:function(e){e||(e={}),Backbone.View.apply(this,arguments),this.id=e.id?e.id:this.$el.attr("id")?this.$el.attr("id"):null,e.autoId&&(this.id=t.uuid()),this.$el.attr("id",this.id)},initialize:function(e){return e||(e={}),this._valid(e),e.el&&this.$el.addClass(this.className),e.theme&&(this._theme=e.theme,this.$el.addClass(this._theme)),e.method&&(this.method=e.method),e.template&&(this._tpl=this._compile(e.template)),this},_valid:function(e){e||(e={});if(e.id&&!_.isString(e.id))throw new n("InvalidIDType");if(!e.model||e.model instanceof Backbone.Model){if(e.method&&!r.RENDER[e.method])throw new n("UnsupportedRenderMethod",{method:"non-existent-method"});return!0}throw new n("InvalidModelType")},_beforeRender:
function(t){if(!this._parent)throw new n("SuccessorNotSpecified");if(this._parent instanceof e.com.spinal.ui.Container){if(this.id&&!this._parent.findById(this.id))throw new n("UIStackViolation",{viewId:"view-error",succesorId:"container-declared-inline"});return this}throw new n("InvalidSuccessorType")},_compile:function(e){return!e||!_.isString(e)&&!_.isFunction(e)?null:_.isString(e)?_.template(e):e},data:function(e){return e||(e={}),this.model?this.model.toJSON():this._parent&&this._parent.model?this._parent.model.toJSON():e},template:function(e,t){return _.isObject(e)&&(t=e,e=null),e=e?this._compile(e):this._tpl,e?this.$el.html(e(this.data(t))):this.$el},render:function(e){e||(e={}),this._beforeRender(arguments).detach();var t=e.method&&r.RENDER[e.method]?e.method:this.method;return this._parent._targetEl()[t](this.template(this._tpl)),e.silent||this.trigger(r.EVENTS.rendered,{view:this}),this.delegateEvents()},update:function(e){return(!e||!e.silent)&&this.trigger(r.EVENTS.updated,
{view:this}),this},theme:function(e){return!e||!_.isString(e)?this:(this.$el.removeClass(this._theme).addClass(e),this._theme=e,this)},lookup:function(e){return e?this._next(e):null},addClass:function(e){return e?(this.$el.addClass(e),this):this},removeClass:function(e){return e?(this.$el.removeClass(e),this):this},show:function(e){return this.$el.show(),(!e||!e.silent)&&this.trigger(r.EVENTS.shown,{view:this}),this},hide:function(e){return this.$el.hide(),(!e||!e.silent)&&this.trigger(r.EVENTS.hidden,{view:this}),this},enable:function(e){return this.$el.removeAttr("disabled"),(!e||!e.silent)&&this.trigger(r.EVENTS.enabled,{view:this}),this},disable:function(e){return this.$el.attr("disabled","true"),(!e||!e.silent)&&this.trigger(r.EVENTS.disabled,{view:this}),this},detach:function(e){return r.__super__.remove.apply(this,arguments),(!e||!e.silent)&&this.trigger(r.EVENTS.detached,{view:this}),this},_next:function(e){return this.id&&this.id===e?this:this._parent?this._parent.lookup(e):null
},toString:function(){return"[object View]"}},{NAME:"View",RENDER:{append:"append",prepend:"prepend",appendTo:"appendTo",prependTo:"prependTo",html:"html"},EVENTS:{shown:"com:spinal:ui:view:shown",hidden:"com:spinal:ui:view:hidden",enabled:"com:spinal:ui:view:enabled",disabled:"com:spinal:ui:view:disabled",rendered:"com:spinal:ui:view:rendered",updated:"com:spinal:ui:view:updated",detached:"com:spinal:ui:view:detached"}}));return r}),define("ui/container",["core/spinal","ui/view","util/adt/collection","util/exception/ui"],function(e,t,n,r){var i=e.namespace("com.spinal.ui.Container",t.inherit({className:"ui-container container",views:null,constructor:function(){t.apply(this,arguments)},initialize:function(e){return e||(e={}),i.__super__.initialize.apply(this,arguments),this.views=new n([],e.interface?{"interface":e.interface}:{}),e.views&&this.addAll(e.views,{silent:!0}),this},_valid:function(e){e||(e={}),i.__super__._valid.apply(this,arguments);if(!e.interface||new e.interface instanceof 
Backbone.View)return!0;throw new r("InvalidInterfaceType")},_resolveSuccesor:function(){if(!this._parent){var e=this.$el.parent().length>0?this.$el.parent()[0].nodeName.toLowerCase():"body";this._parent=new i({el:e}),this._parent.add(this,{silent:!0})}return this},_targetEl:function(){return this.$el},theme:function(e){return this.views.isEmpty()||this.invoke("theme",arguments),i.__super__.theme.apply(this,arguments),this},render:function(){return this._resolveSuccesor(),i.__super__.render.apply(this,arguments),this.invoke("render",arguments),this},update:function(e){return e||(e={}),i.__super__.update.apply(this,arguments),this.invoke("update",arguments),this},add:function(e,t){t||(t={});var n=e.id?this.findById(e.id):this.findByCID(e.cid);return n||(e=this.views.add(e),e._parent=this,t.renderOnAdd&&e.render(t),t.silent||this.trigger(i.EVENTS.added,{added:e,view:this})),e},addAll:function(e,t){return t||(t={}),_.map(e,function(e){return this.add(e,t)},this)},remove:function(e,t){t||(t=
{});var n=this.getPos(e);return _.isNull(n)||(this.views.remove(n),e._parent=null,t.detachOnRemove&&e.detach(),t.silent||this.trigger(i.EVENTS.removed,{removed:e,view:this})),this},removeAll:function(){return this.views.isEmpty()||this.invoke("detach",arguments),this.views.reset(),this},get:function(e){return this.views.get(e)},getPos:function(e){return this.views.findPosBy(function(t){return t.cid&&t.cid===e.cid})},findByCID:function(e){return e?this.views.find(function(t){return t.cid&&t.cid===e}):null},findById:function(e){return e?this.views.find(function(t){return t.id&&t.id===e}):null},filter:function(e){return this.views.findBy(e)},invoke:function(e){if(this.views.size()===0)return[];var t=Array.prototype.slice.call(arguments,1);return this.views.invoke(e,t)},show:function(){return i.__super__.show.apply(this,arguments),this.invoke("show",arguments),this},hide:function(){return i.__super__.hide.apply(this,arguments),this.invoke("hide",arguments),this},enable:function(){return i.__super__
.enable.apply(this,arguments),this.invoke("enable",arguments),this},disable:function(){return i.__super__.disable.apply(this,arguments),this.invoke("disable",arguments),this},detach:function(){return this.views.isEmpty()||this.invoke("detach",arguments),i.__super__.detach.apply(this,arguments),this},toString:function(){return"[object Container]"}},{NAME:"Container",EVENTS:{added:"com:spinal:ui:container:added",removed:"com:spinal:ui:container:removed"}}));return i}),define("ui/basic/paragraph",["ui/view"],function(e){var t=Spinal.namespace("com.spinal.ui.basic.Paragraph",e.inherit({className:"ui-paragrah",tagName:"p",_content:"",initialize:function(e){return e||(e={}),e.content&&(this._content=e.content),t.__super__.initialize.apply(this,arguments),this},render:function(e){return t.__super__.render.apply(this,arguments),this.content()},content:function(e){return this._content=e?e:this._content,this.$el.html(this._content),this}},{NAME:"Paragraph"}));return t}),define("ui/basic/link",["ui/basic/paragraph"
],function(e){var t=Spinal.namespace("com.spinal.ui.basic.Link",e.inherit({className:"ui-link",tagName:"a",_href:"",initialize:function(e){return e||(e={}),e.href&&(this._href=e.href),t.__super__.initialize.apply(this,arguments),this},render:function(e){return t.__super__.render.apply(this,arguments),this.href()},href:function(e){return this._href=e?e:this._href,this.$el.attr("href",this._href),this}},{NAME:"Link"}));return t}),define("ui/basic/header",["ui/basic/paragraph"],function(e){var t=Spinal.namespace("com.spinal.ui.basic.Header",e.inherit({className:"ui-header",tagName:"h",_heading:"1",constructor:function(e){e||(e={}),e.heading&&(this._heading=e.heading),this.tagName=this.tagName+this._heading,t.__super__.constructor.apply(this,arguments)},initialize:function(e){return e||(e={}),t.__super__.initialize.apply(this,arguments),this}},{NAME:"Header"}));return t}),define("ui/basic/label",["ui/basic/paragraph"],function(e){var t=Spinal.namespace("com.spinal.ui.basic.Label",e.inherit(
{className:"ui-label",tagName:"label",_afor:null,initialize:function(e){return e||(e={}),e.afor&&(this._afor=e.afor),t.__super__.initialize.apply(this,arguments),this},render:function(e){return t.__super__.render.apply(this,arguments),this.afor()},afor:function(e){return this._afor=e?e:this._afor,this._afor&&this.$el.attr("for",this._afor),this}},{NAME:"Label"}));return t}),define("ui/basic/span",["ui/basic/paragraph"],function(e){var t=Spinal.namespace("com.spinal.ui.basic.Span",e.inherit({className:"ui-span",tagName:"span",initialize:function(e){return e||(e={}),t.__super__.initialize.apply(this,arguments),this}},{NAME:"Span"}));return t}),define("ui/basic/image",["ui/view"],function(e){var t=Spinal.namespace("com.spinal.ui.basic.Image",e.inherit({className:"ui-image",tagName:"img",_src:null,_alt:"",initialize:function(e){return e||(e={}),e.src&&(this._src=e.src),e.alt&&(this._alt=e.alt),t.__super__.initialize.apply(this,arguments),this},render:function(e){return t.__super__.render.apply
(this,arguments),this.src().alt()},src:function(e){return this._src=e?e:this._src,this.$el.attr("src",this._src),this},alt:function(e){return this._alt=e?e:this._alt,this.$el.attr("alt",this._alt),this}},{NAME:"Image"}));return t}),define("ui/misc/panel",["ui/container"],function(e){var t=Spinal.namespace("com.spinal.ui.misc.Panel",e.inherit({className:"ui-panel panel",tagName:"div",_title:"Default Title",_type:null,initialize:function(e){return e||(e={}),e.title&&(this._title=e.title),this._type=e.type?e.type:t.TYPES.standard,e.template=Spinal.app.html_tpl("spinal.basic.panel",{}),t.__super__.initialize.apply(this,arguments),this},_targetEl:function(){return this.$el.children(".panel-body")},render:function(e){return t.__super__.render.apply(this,arguments),this.title().type()},title:function(e){return this._title=e?e:this._title,this.$el.children(".panel-heading").html(this._title),this},type:function(e){return this.$el.removeClass(this._type),this._type=e&&e!==this._type?e:this._type
,this.$el.addClass(this._type),this}},{NAME:"Panel",TYPES:{standard:"panel-default",primary:"panel-primary",success:"panel-success",info:"panel-info",warning:"panel-warning",danger:"panel-danger"}}));return t}),define("ui/list/list-item",["ui/container"],function(e){var t=Spinal.namespace("com.spinal.ui.list.ListItem",e.inherit({className:"ui-list-item list-group-item",tagName:"li",initialize:function(e){return e||(e={}),t.__super__.initialize.apply(this,arguments),this}},{NAME:"ListItem"}));return t}),define("ui/list/list",["ui/container","ui/list/list-item"],function(e,t){var n=Spinal.namespace("com.spinal.ui.list.List",e.inherit({className:"ui-list list-group",tagName:"ul",initialize:function(e){return e||(e={}),e.interface=t,e.items&&e.items.length>0&&(e.views=e.items,delete e.items),n.__super__.initialize.apply(this,arguments),this}},{NAME:"List"}));return n}),define("ui/table/table-element",["ui/container"],function(e){var t=Spinal.namespace("com.spinal.ui.table.TableElement",e.inherit
({className:"ui-table-",tagName:"",_t:"",constructor:function(e){e||(e={}),e.el||(this._t=e.t?e.t:t.TYPES.row,this.tagName=this._t),this.className=e.el?"":this.className+this._t,t.__super__.constructor.apply(this,arguments)},initialize:function(e){return e||(e={}),t.__super__.initialize.apply(this,arguments),this}},{NAME:"TableElement",TYPES:{head:"th",row:"td",column:"tr"}}));return t}),define("ui/table/table",["ui/container","ui/table/table-element","util/string"],function(e,t,n){var r=Spinal.namespace("com.spinal.ui.table.Table",e.inherit({className:"ui-table table",tagName:"table",header:null,footer:null,_thead:null,_tbody:null,_tfoot:null,initialize:function(e){return e||(e={}),e.interface=t,_.extend(this,n.toPrivate(_.pick(e,"thead","tbody","tfoot"))),r.__super__.initialize.apply(this,arguments),this._head()._body()._foot()},_create:function(e){return Spinal.app.html_tpl("spinal.table.t",{_$:{t:e,cls:"ui-table-"+e}})},_head:function(){if(!this._thead||this._thead.length===0)return""
;var e=this.add({t:r.SECTIONS.head,"interface":t},{silent:!0});return this._content(this._thead,e,t.TYPES.head,"_col")},_body:function(){if(!this._tbody||this._tbody.length===0)return"";var e=this.add({t:r.SECTIONS.body,"interface":t},{silent:!0});return this._content(this._tbody,e,t.TYPES.row,"_col")},_foot:function(){if(!this._tfoot||this._tfoot.length===0)return"";var e=this.add({t:r.SECTIONS.foot,"interface":t},{silent:!0});return this._content(this._tfoot,e,t.TYPES.row,"_col")},_content:function(e,t,n,r){return _.each(e,_.bind(this[r],this,n,t,{silent:!0})),this},_col:function(e,n,r,i){var s=_.omit(i,"rows","el","t"),o=this._create(t.TYPES.column),u=n.add(_.extend({el:$(o),"interface":t},this.onColumn(s)),r);this._content(i.rows,u,e,"_row")},_row:function(e,n,r,i){var s=this._create(e);return n.add(_.extend({el:$(s),"interface":t},this.onRow(i)),r),s},onColumn:function(e){return e},onRow:function(e){return{template:e}}},{NAME:"Table",SECTIONS:{head:"thead",body:"tbody",foot:"tfoot"
}}));return r}),define("ui/form/controls/fieldset",["ui/container"],function(e){var t=Spinal.namespace("com.spinal.ui.form.controls.Fieldset",e.inherit({className:"ui-fieldset",tagName:"fieldset",initialize:function(e){return e||(e={}),t.__super__.initialize.apply(this,arguments),this}},{NAME:"UIFieldset"}));return t}),define("ui/form/controls/button",["ui/view"],function(e){var t=Spinal.namespace("com.spinal.ui.form.controls.Button",e.inherit({events:{click:"_onClick"},className:"ui-button btn",tagName:"button",_text:"default",_type:null,initialize:function(e){return e||(e={}),e.text&&(this._text=e.text),this._type=e.type?e.type:t.TYPES.standard,t.__super__.initialize.apply(this,arguments),this},render:function(e){return t.__super__.render.apply(this,arguments),this.text().type()},text:function(e){return this._text=e?e:this._text,this.$el.html(this._text),this},type:function(e){return this.$el.removeClass(this._type),this._type=e&&e!==this._type?e:this._type,this.$el.addClass(this._type
),this},_onClick:function(e){this.trigger(t.EVENTS.clicked,this)}},{NAME:"UIButton",EVENTS:{clicked:"com:spinal:ui:view:form:controls:button:clicked"},TYPES:{standard:"btn-default",primary:"btn-primary",success:"btn-success",info:"btn-info",warning:"btn-warning",danger:"btn-danger",link:"btn-link"}}));return t}),define("ui/form/controls/input",["ui/view","util/string"],function(e,t){var n=Spinal.namespace("com.spinal.ui.form.controls.Input",e.inherit({events:{click:"_onClick",keyup:"_onKeyUp",keydown:"_onKeyDown",focusIn:"_onFocus",focusOut:"_onBlur"},className:"ui-input form-control",tagName:"input",_value:"",_type:null,_name:null,_placeholder:null,initialize:function(e){return e||(e={}),_.extend(this,t.toPrivate(_.pick(e,"name","value","placeholder"))),this._type=e.type?e.type:n.TYPES.text,n.__super__.initialize.apply(this,arguments),this},render:function(e){return n.__super__.render.apply(this,arguments),this.type().name().placeholder().value()},name:function(e){return this._name=e&&
e!==""?e:this._name,this.$el.attr("name",this._name),this},value:function(e){return this._value=e?e:this._value,this.$el.val(this._value),this},placeholder:function(e){return this._placeholder=e?e:this._placeholder,this.$el.attr("placeholder",this._placeholder),this},type:function(e){return this._type=e&&e!==""&&e!==this._type?e:this._type,this.$el.attr("type",this._type),this},_onClick:function(e){this.trigger(n.EVENTS.click,this)},_onKeyUp:function(e){this.trigger(n.EVENTS.keyup,this)},_onKeyDown:function(e){this.trigger(n.EVENTS.keydown,this)},_onFocus:function(e){this.trigger(n.EVENTS.focus,this)},_onBlur:function(e){this.trigger(n.EVENTS.blur,this)}},{NAME:"UIInput",EVENTS:{click:"com:spinal:ui:view:form:controls:input:click",keyup:"com:spinal:ui:view:form:controls:input:keyup",keydown:"com:spinal:ui:view:form:controls:input:keydown",focus:"com:spinal:ui:view:form:controls:input:focus",blur:"com:spinal:ui:view:form:controls:input:blur"},TYPES:{text:"text",radio:"radio",checkbox:"checkbox"
,password:"password",hidden:"hidden",number:"number",date:"date"}}));return n}),define("ui/form/controls/textarea",["ui/form/controls/input"],function(e){var t=Spinal.namespace("com.spinal.ui.form.controls.Textarea",e.inherit({className:"ui-textarea",tagName:"textarea",initialize:function(e){return e||(e={}),t.__super__.initialize.apply(this,arguments),this},render:function(e){return t.__super__.render.apply(this,arguments),this.name().placeholder().value()}},{NAME:"UITextarea"}));return t}),define("ui/form/controls/option",["ui/view"],function(e){var t=Spinal.namespace("com.spinal.ui.form.controls.Option",e.inherit({className:"ui-option",tagName:"option",_value:"",_text:null,initialize:function(e){return e||(e={}),e.value&&(this._value=e.value),e.text&&(this._text=e.text),t.__super__.initialize.apply(this,arguments),this},render:function(e){return t.__super__.render.apply(this,arguments),this.value().text()},text:function(e){return this._text=e&&e!==""?e:this._text,this.$el.html(this._text
),this},value:function(e){return this._value=e?e:this._value,this.$el.val(this._value),this},toString:function(){return"[object Option]"}},{NAME:"UIOption"}));return t}),define("ui/form/controls/select",["ui/container","ui/form/controls/option"],function(e,t){var n=Spinal.namespace("com.spinal.ui.form.controls.Select",e.inherit({events:{change:"_onChange"},className:"ui-select",tagName:"select",_name:null,initialize:function(e){return e||(e={}),e.interface=t,e.options&&e.options.length>0&&(e.views=e.options,delete e.options),n.__super__.initialize.apply(this,arguments),this},render:function(e){return n.__super__.render.apply(this,arguments),this.name()},name:function(e){return this._name=e&&e!==""?e:this._name,this.$el.attr("name",this._name),this},_onChange:function(e){this.trigger(n.EVENTS.changed,this)}},{NAME:"UISelect",EVENTS:{changed:"com:spinal:ui:view:form:controls:select:changed"}}));return n}),define("spinal-ui",["ui/view","ui/container","ui/basic/paragraph","ui/basic/link","ui/basic/header"
,"ui/basic/label","ui/basic/span","ui/basic/image","ui/misc/panel","ui/list/list","ui/list/list-item","ui/table/table","ui/table/table-element","ui/form/controls/fieldset","ui/form/controls/button","ui/form/controls/input","ui/form/controls/textarea","ui/form/controls/select","ui/form/controls/option"],function(){});