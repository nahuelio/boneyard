//	SpinalJS Ioc@0.0.1 (c) 2014 Patricio Ferreira <3dimentionar@gmail.com>, 3dimention.com
//	SpinalJS may be freely distributed under the MIT license.
//	For all details and documentation: http://3dimention.github.io/spinal
define("ioc/engine",["ioc/context","util/adt/collection","util/exception/context"],function(e,t,n){var r=Spinal.namespace("com.spinal.ioc.Engine",Spinal.SpinalClass.inherit({root:{},specs:null,factory:null,annotations:{_id:"id",_specs:"specs",_ready:"ready",_plugins:"plugins"},initialize:function(e){if(!e)throw new n("FactoryNotDeclared",{clazz:r.NAME});return this.factory=e,this.specs=new t([]),_.each(this.annotations,function(e,t){this["__"+e]=r.PREFIX+e},this),this},_valid:function(e){if(!_.isObject(e))throw new n("InvalidSpecFormat");if(!e[this.__id])throw new n("SpecIdRequired")},_addSpec:function(e){_.extend(this.root,_.omit(e,this.__id,this.__specs,this.__ready)),this.specs.add(e[this.__id])&&e[this.__ready]&&(_.isUndefined(this.root[this.__ready])&&(this.root[this.__ready]=[]),this.root[this.__ready]=_.union(this.root[this.__ready],e[this.__ready]))},build:function(e){return this._valid(e),this.specs.contains(e[this.__id])||this._addSpec(e),e[this.__specs]&&this.invoke("build",e
[this.__specs]),this},ready:function(){return this.root.$ready&&_.isArray(this.root.$ready)&&_.every(_.pluck(this.root.$ready,"_$ready"))},plugin:function(){return this.root.$plugins},getBonesBy:function(e){return this.root?_.compact(_.map(this.root,function(t,n){return e(t,n)?this.getBone(n):null},this)):[]},getBone:function(e){return this.root&&this.root[e]?this.isCreated(this.root[e])?this.root[e]._$created:this.root[e]:null},getBonesByClass:function(e){return this.getBonesBy(_.bind(function(t,n){return this.isModule(t)&&this.isCreated(t)&&t._$created.constructor.NAME===e},this))},getBonesByType:function(e){return this.getBonesBy(_.bind(function(t,n){return this.isModule(t)&&this.isCreated(t)?this.getBone(n)instanceof e:t instanceof e},this))},isModule:function(e){return e&&e.$module},isCreated:function(e){return e&&e._$created}},{NAME:"Engine",PREFIX:"$",EVENTS:{proxified:"com:spinal:ioc:engine:proxified",plugin:"com:spinal:ioc:engine:plugin-notification"}}));return r}),define("ioc/processor/bone"
,["core/spinal","ioc/engine","util/exception/context","util/exception/processor"],function(e,t,n,r){var i=e.namespace("com.spinal.ioc.processor.BoneProcessor",e.SpinalClass.inherit({_engine:null,annotations:{_r:"bone!",_d:"!"},initialize:function(e){if(!e)throw new n("EngineNotDeclared");return this._engine=e,this},_root:function(){return this._engine.root},validate:function(e,n){return!e||!_.isString(e)?!1:(n||(n=this.annotations._r),(t.PREFIX+e).indexOf(n)!==-1)},isModuleDependency:function(e){return!e||!_.isString(e)?!1:this._engine.isModule(this.getDependency(e))},getDependencyId:function(e,t){if(!e||!_.isString(e))return null;var n=e.indexOf(t&&t!==""?t:this.annotations._d);return n>0?e.substring(n+1,e.length):null},getDependency:function(e,t){var n=this.getDependencyId.apply(this,arguments);return n?this._engine.getBone(n):null},execute:function(e,t){if(!e||!_.isFunction(e))return!1;var n=[],r=t?t:this._root();for(var i in r){var s=e.call(this,r[i],i,t?r:null);if(!s)break;n.push(s
)}return _.compact(_.flatten(n))}},{NAME:"BoneProcessor",EVENTS:{processed:"com:spinal:ioc:processor:processed"}}));return i}),define("ioc/context",["core/spinal","util/string","util/adt/iterator","util/factories/async-factory","util/exception/context","ioc/processor/bone","ioc/engine"],function(e,t,n,r,i,s,o){var u=e.namespace("com.spinal.ioc.Context",e.SpinalClass.inherit({id:t.uuid(),engine:null,factory:null,processors:new n([{id:"PluginProcessor",path:"ioc/processor/plugin"},{id:"CreateProcessor",path:"ioc/processor/create"},{id:"ReadyProcessor",path:"ioc/processor/ready"}]),initialize:function(){return this.factory=new r,this.engine=new o(this.factory),this.listenTo(this.engine,o.EVENTS.proxified,_.bind(this.proxify,this)),this.listenTo(this.engine,o.EVENTS.plugin,_.bind(this.notify,this)),this.proxify(this.engine,"getBone","getBonesByType","getBonesByClass"),this},_loadProcessors:function(e){return this.processors.rewind(),this.factory.getFactory("CreateProcesor")?this._onProcessorsLoaded
(e):this.factory.set(this.processors.collection).load(_.bind(this._onProcessorsLoaded,this,e)),this},_onProcessorsLoaded:function(e){while(this.processors.hasNext()){var t=this.processors.next();t.module=this.bonefactory("create",t.id,this.engine),t.module.once(s.EVENTS.processed,_.bind(this._next,this,t.module,e))}return this.processors.rewind()&&this._next()},_next:function(e,t){return e&&this.notify(u.EVENTS.processorCompleted,null,e),this.processors.hasNext()?this.processors.next().module.execute():this.notify(u.EVENTS.initialized,t,this)},bonefactory:function(e){if(!e)return null;var t=Array.prototype.slice.call(arguments,1);return this.factory[e]?this.factory[e].apply(this.factory,t):null},wire:function(e,t){if(!e)return t(this),this;if(!_.isObject(e))throw new i("InvalidSpecFormat");return this.engine.build(e),this._loadProcessors(t)},notify:function(e,t){t&&_.isFunction(t)&&t(this);if(e&&_.isString(e)){var n=Array.prototype.slice.call(arguments,2);n.unshift(e),this.trigger.apply
(this,n)}}},{NAME:"Context",EVENTS:{initialized:"com:spinal:ioc:context:initialized",processorCompleted:"com:spinal:ioc:context:processor:completed"},Initialize:function(e,t){return arguments.length===1&&_.isFunction(e)?(new u).wire(null,e):(new u).wire(e,t)},LazyLoad:function(e,t){require([e],t)}})),a=$("script[data-spec]").data("spec");return a&&u.LazyLoad(a,function(t){e.app=u.Initialize(t)}),u}),define("ioc/processor/plugin",["ioc/context","ioc/processor/bone","util/exception/processor"],function(e,t,n){var r=Spinal.namespace("com.spinal.ioc.processor.PluginProcessor",t.inherit({defaultPath:"ioc/plugins/",initialize:function(){return r.__super__.initialize.apply(this,arguments)},_enqueue:function(e,t){return this._engine.factory.push({id:e,path:this.defaultPath+e,callback:t}),this},_create:function(e,t){return this._engine.factory.create(t,e?e:{},this._engine).execute()},process:function(e){return _.map(e,function(e,t){return this._enqueue(t,_.bind(_.partial(this._create,e),this)),t
},this)},execute:function(){var e=this._engine.plugin()?this.process(this._engine.root[this._engine.__plugins]):[];return this._engine.factory.load(_.bind(function(){delete this._engine.root[this._engine.__plugins],this.trigger(r.EVENTS.processed,{type:r.NAME,plugins:e})},this)),this}},{NAME:"PluginProcessor"}));return r}),define("ioc/processor/create",["ioc/context","ioc/engine","ioc/processor/bone","util/exception/processor"],function(e,t,n,r){var i=Spinal.namespace("com.spinal.ioc.processor.CreateProcessor",n.inherit({initialize:function(){return i.__super__.initialize.apply(this,arguments)},_root:function(){return _.omit(this._engine.root,function(e,n){return n.indexOf(t.PREFIX)===0})},_enqueue:function(e,t,n){if(!(module=this._engine.getBone(e)))throw new r("BoneNotFound");return this._engine.factory.push({id:e,path:module.$module,callback:t}),this._sorting(e,module,n)},_sorting:function(e,t,n){if(n.length===0)return t;var r=_.map(n,function(e){return this._engine.factory.findPosById
(e.id)},this);return this._engine.factory.swap(_.bind(function(t,n,r,i){return e===r.id&&i<=t?t:i},this,_.max(r),_.min(r))),t},_create:function(e,t,n){if(!t||!n)throw new r("CreateModuleException");return e&&e.length>0&&this._inject(t.$params,e),t._$created=this._engine.factory.create(n,t.$params)},_inject:function(e,t){_.each(t,function(t){e[t.property]=this._engine.getBone(t.id)},this)},_dependencies:function(e){return _.compact(_.map(e,function(e,t,n){if(!this._resolve(e,n,t))return{id:this.getDependencyId(e),property:t}},this))},_resolve:function(e,t,n){if(!e||!t)return null;if(!this.validate(e))return n;if(!this.isModuleDependency(e))return t[n]=this.getDependency(e)},process:function(e,t,n){if(this._engine.isModule(e)){var r=this._dependencies(e.$params);return this._enqueue(t,_.bind(_.partial(this._create,r,e),this),r)}return _.isObject(e)||_.isArray(e)?i.__super__.execute.call(this,this.process,e,t):_.isNull(n)?e:this._resolve(e,n,t)},execute:function(){var e=i.__super__.execute
.call(this,this.process);return this._engine.factory.load(_.bind(function(){this.trigger(i.EVENTS.processed,{type:i.NAME,bones:e})},this)),this}},{NAME:"CreateProcessor"}));return i}),define("ioc/processor/ready",["ioc/context","ioc/processor/bone","ioc/engine"],function(e,t,n){var r=Spinal.namespace("com.spinal.ioc.processor.ReadyProcessor",t.inherit({initialize:function(){return r.__super__.initialize.apply(this,arguments)},_inject:function(e){return _.isArray(e)?_.map(e,function(e){return this.validate(e)&&(bone=this.getDependency(e))?bone:e},this):{}},_resolve:function(e,t){return _.compact(_.map(e,function(e){if(this.validate(e)&&(info=this.getDependencyId(e).split("."))&&info.length>1&&(bone=this._engine.getBone(info[0])))return bone[info[1]].apply(bone,this._inject(_.flatten(t))),e},this))},process:function(e){return!e||e.length===0?[]:_.compact(_.map(e,function(e){return!_.isObject(e)||e._$ready?null:this._resolve(_.keys(e),_.values(e))&&(e._$ready=!0)},this))},execute:function(
){var e=this._engine.ready()?[]:this.process(this._engine.root.$ready);return this.trigger(r.EVENTS.processed,{type:r.NAME,actions:e}),this}},{NAME:"ReadyProcessor"}));return r}),define("ioc/plugins/html",["ioc/engine","util/string"],function(e,t){var n=Spinal.namespace("com.spinal.ioc.plugins.HTMLPlugin",Spinal.SpinalClass.inherit({_engine:null,_packages:null,_tpls:{},initialize:function(e,t){return this._engine=t,this._packages=_.isEmpty(e)?{}:e,this},_query:function(e,n){return t.search(e,n?Spinal.templates:this._tpls)},_lazy:function(){var e=_.compact(_.map(this._packages,function(e,t){return e.lazyLoading?t:null}));return this.html_load(e)},html_loaded:function(e){return _.has(this._packages,e)&&!_.isUndefined(this._tpls[e])},html_load:function(t,n){if(!t)return this;_.isString(t)&&t!==""&&(t=[t]);var r=e.EVENTS.plugin,i=_.compact(_.map(this._packages,function(e,n){return _.contains(t,n)?e.path:null}));return require(i,_.bind(function(){_.extend(this._tpls,_.object(t,Array.prototype
.slice.call(arguments))),n&&_.isFunction(n)&&n(),this._engine.trigger(e.EVENTS.plugin,r,t)},this)),this},html_tpl:function(e,t){if(!e||e==="")return"";t||(t={});var n=e.indexOf("!")===-1,r=this._query(e.replace("!","."),n);return r&&_.isString(r)&&(r=_.template(unescape(r))),(r&&_.isFunction(r)?r(t):"").replace(/\n/g,"").replace(/\t/g," ")},execute:function(){return this._engine.trigger(e.EVENTS.proxified,this,"html_load","html_loaded","html_tpl"),this._lazy()}},{NAME:"HTMLPlugin"}));return n}),define("ioc/plugins/theme",["ioc/engine","util/adt/collection"],function(e,t){var n=Spinal.namespace("com.spinal.ioc.plugins.ThemePlugin",Spinal.SpinalClass.inherit({themes:null,_config:null,_engine:null,_$header:null,_link:_.template('<link rel="stylesheet" href="<%= href %>" theme="<%= theme %>" />'),_bootstrap:{core:"bootstrap/css/bootstrap.min.css",theme:"bootstrap/css/bootstrap-theme.min.css"},initialize:function(e,t){if(!e||!e.config||!e.config.basePath)throw new PluginException("ConfigNotSpecified"
);return this.themes=_.omit(e,"config"),this._config=e.config,this._engine=t,this._$header=$("head"),this._useDefault()},_useDefault:function(){if(this._config.bootstrap){var e=this._link({theme:"bootstrap",href:this._resolveURI({path:this._bootstrap.core})})+this._link({theme:"bootstrap-theme",href:this._resolveURI({path:this._bootstrap.theme})});this._$header.append(e)}return this},_resolveURI:function(e){return e.url?e.url:this._config.basePath+e.path},findTheme:function(e){var t=_.find(this.themes,function(t,n){return!e&&t._default&&(e=n)||e===n});return t?{name:e,config:t}:this.theme_current()},process:function(){var e=this.theme_current(),t='link[theme!="'+e.name+'"][theme!="bootstrap"][theme!="bootstrap-theme"]',n=this._$header.children(t);return n.length>0&&n.remove(),this._$header.append(this._link({theme:e.name,href:this._resolveURI(e.config)})),this},theme_current:function(){return this.theme},theme_change:function(e){return this.theme=this.findTheme(e),this.process()},execute
:function(){return _.isEmpty(this.themes)||(this.theme_change(),this._engine.trigger(e.EVENTS.proxified,this,"theme_change","theme_current")),this}},{NAME:"ThemePlugin"}));return n}),define("spinal-ioc",["ioc/context","ioc/engine","ioc/processor/bone","ioc/processor/plugin","ioc/processor/create","ioc/processor/ready","ioc/plugins/html","ioc/plugins/theme"],function(){});