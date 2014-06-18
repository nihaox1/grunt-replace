$c.extend({
	/*!
	 *	@$modal 		: JQdom 	待切换page的父级
	 *	@pages 			: object 	待填充的page项 配置地址
	 *	@args 			: object || false 	配置文件
	 *	args = {
			tag 	: "div" 	// 默认为div
	 	};
	 */
	page 	: function( $modal , pages , args ) {
		var Page,
			config,
			tool,
			manage,
			self = this;

		Page = function( name , url ){
			var _self 	= this,
				_config,
				_tool;
			_tool = {
				config : function(){
					_config = {
						parent 		: $modal,
						container 	: false,
						name 		: name,
						url 		: url,
						init 		: false,
						loading 	: false
					};
					if( config.__config ){
						_config.container = $( "<" + config.__config.tag + ">" , { class : "c_page_container " + name , _page : name } );
						_config.parent.append( _config.container );
					};
				}
			};
			_tool.config();
			this.__config = _config;
			this.config = _config;
		};

		Page.fn = Page.prototype = {
			/*!
			 *	将args对象 扩展到page里
			 *	@args 		： 待扩展的对象
			 *	@add_to_prototype 	boolean 是否扩展到原型上
			 */
			extend 		: function( args , add_to_prototype ){
				if( typeof args === "object" ){
					for( var a in args ){
						if( add_to_prototype ){
							Page.fn[ a ] = args[ a ];
						} else {
							this[ a ] = args[ a ];
						};
					};
				};
				return this;
			},
			/*!
			 *	page项的集合
			 */
			pages 	: {},
			/*!
			 *	获取当前模块
			 *	@func 	: 回调事件
			 */
			get : function( func ){
				if( !this.__config.init ){
					this.__config.loading = true;
					tool.require( this , func );
				} else {
					func();
				};
				return this;
			},
			/*!
			 *	@func 	: 回调事件
			 */
			display : function( func ){
				var _self = this,
					_x = function(){
						if( _self.__config.loading ){ return false; };
						for( var a in Page.fn.pages ){
							if( a !== _self.__config.name ){
								Page.fn.pages[ a ].hide();
							} else if( _self.__config.container ){
								_self.__config.container.addClass( "c_page_active" );
							};
						};
						if( func ){ func.call( _self ); };
					};
				this.get( _x );
				return this;
			},
			/*!
			 *	@is_all		: boolean 	// 是否隐藏所有的page项
			 */
			hide : function( is_all ){
				if( is_all ){
					for( var a in Page.fn.pages ){
						Page.fn.pages[ a ].hide();
					};
				} else if( this.__config.container ) {
					this.__config.container.removeClass( "c_page_active" );
				};
				return this;
			},
			/*!
			 *	快速定位 子模块的子集
			 *	@name 	子模块 的name名称
			 *	return  子模块的暴露的方法集合
			 */
			child : function( name ){
				var _page = $c.define( true ).page_defines[ this.__config.name ];
				if( _page.children[ name ] ){
					return _page.children[ name ].__exports;
				};
				return this;
			}
		};

		tool = {
			/*!
			 *	根据pages中的配置  请求对应的模块信息
			 *	@func 	: 回调函数
			 */
			require : function( page , func ){
				$c.alert.set();
				/*!
				 *	解决 其它模块在请求初期 constructor 与 display 中的回调事件 事件调用顺序错位
				 *	@__func 	: func 建立 page与define的  事件关联
				 */
				page.__func = func;
				$c.modal.require( {
					url 	: page.__config.url,
					callback: function(){
						$c.alert.unset();
						page.__config.init = true;
						page.__config.loading = false;
					}
				} );
			},
			set_pages : function( pages ){
				if( config.__config ){
					config.__$modal.addClass( "c_page_container_parent" );
				};
				for( var a in pages ){
					if( !Page.fn.pages[ a ] ){
						Page.fn.pages[ a ] = new Page( a , pages[ a ] );
						if( manage[ a ] ){
							manage[ "_" + a ] = Page.fn.pages[ a ];
						} else {
							manage[ a ] = Page.fn.pages[ a ];
						};
					};
				};
			},
			config : function( $modal , pages , args ){
				args = args === false ? false : {
					tag 		: args.tag || "div"
				};
				config = {
					__$modal 		: $modal,
					__page 			: pages,
					__config 		: args
				};
			},
			init : function(){
				if( !( $modal instanceof jQuery ) ){
					pages 	= $modal;
					args 	= false;
					$modal 	= $( document.body );
				};
				tool.config( $modal , pages , args === false ? false : ( args || {} ) );
				tool.set_pages( pages );
			}
		};

		manage = {
			pages 	: Page.fn.pages
		};
		tool.init();
		return manage;
	},
	/*!
	 *	子模块定义
	 *	@args 		object  define参数
	 *	args = {
	 		page/parent 	: Page,
	 		url 			: string || array 请求路径地址
	 		constructor 	: func 	要求return扩展功能	构建模块
	 	}
	 */
	define : (function(){
		var tool,
			config,
			manage,
			Define;

		/*!
		 *	@args = {
		 		page 		: page 		|| $g.home
				urls 		: string || [ str ],
				constructor : func
		 }
		 */
		Define = function( args ){
			if( !args || typeof args !== "object" ){ return false; };
			this.__args = args;
			tool.require.call( this , args );
		};

		Define.fn = Define.prototype = {
			__events : [],
			on_require_change : function( func ){
				if( !func || typeof func !== "function" ){
					config.change_list[ config.change_list.length++ ] = func;
				};
			}
		};

		tool = {
			change_list : function( page ){
				for( var i = config.change_list.length ; i--; ){
					config.change_list[ i ].call( page );
				};
			},
			add_exports : function( args , page ){
				var page = page || this,
					_rtn = args.constructor.call( page );
				if( _rtn ){
					for( var a in _rtn ){
						if( a === "__proto__" || a === "prototype" ){ continue; };
						page[ a ] = _rtn[ a ];
					};
				};
				return _rtn;
			},
			/*!
			 *	等待所有的require完成后  再执行constructor 的事件处理
			 *	@func 	
			 */
			handle : function( args , func ){
				var _page 	= args.page || args.parent,
					_define = config.page_defines[ _page.__config.name ],
					_x 		= function(){
						if( func ){ func(); };
					};
				if( !--_define.__init ){
					for( var i = _define.__events.length; i--; ){
						_define.__events[ i ].__exports = ( tool.add_exports( _define.__events[ i ] , _page ) );
					};
					_define.__events.length = 0;
					if( func ){ func.call( _page ) };
				};
			},
			/*!
			 *	关联page与子项的事件队列
			 *	@args 	define 的参数
			 *	@page 	Page项
			 */
			set_sinlge_page_define : function( args , page ){
				if( !page ){
					config.page_defines[ args.page.__config.name ] = {
						children 	: {},
						page 		: args.page,
						__init 		: 1,
						__events 	: [ args ]
					};
				} else {
					config.page_defines[ page.__config.name ].children[ args.name || $c.tool.uniqueid() ] = args;
					config.page_defines[ page.__config.name ].__init++;
					config.page_defines[ page.__config.name ].__events.push( args );
				};
			},
			require : function( args ){
				args.url = args.url instanceof Array ? args.url : 
								typeof args.url === "string" ? [ args.url ] : [];
				$c.alert.set();
				var _self 		= this,
					_require 	= {
						url 	: args.url,
						order 	: args.order,
						callback: function(){
							tool.handle( args , function(){
								if( this.__func ){
									this.__func.call( args.page );
									delete this.__func;
								};
								$c.alert.unset();
							} );
						}
					};
				tool.set_sinlge_page_define( args , args.page ? undefined : args.parent );
				$c.modal.require( _require );
			},
			config : function(){
				config = {
					page_defines: { length : 0 },
					defines 	: { length : 0 },
					/*!
					 *	监听请求模块 完成后的执行事件队列
					 */
					change_list : { length : 0 }
				};
			}
		};

		tool.config();
		Define.fn.config = config;
		return function( args ){ 
			if( typeof args === "boolean" ){
				return config;
			} else {
				new Define( args );
			};  
		};
	})()
});