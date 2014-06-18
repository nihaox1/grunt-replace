function E( x ){try{console.log(x);}catch(e){};};
(function(){
var _cAsync = window._cAsync = function(){};

_cAsync.fn = _cAsync.prototype = (function(){
	var tool,
		manage,
		config = {
			fn : {},
			list : {}
		};
	tool = {
		extend : function( args ){
			var _name;
			for( var a in args ){
				if( config.fn[ a ] ){
					if( config.list[ a ] ){
						_name = a + ++config.list[ a ];
						config.fn[ _name ] = args[ a ];
					} else {
						_name = "_" + a;
						config.fn[ _name ] = args[ a ];
						config.list[ a ] = 1;
					};
				} else {
					_name = a;
					config.fn[ a ] = args[ a ];
				};
				_cAsync.prototype[ _name ] = args[ a ];
			};
		}
	};
	manage = {
		config : config,
		extend : function( args ){
			if( !args || typeof args !== "object" ){ return false; };
			tool.extend( args );
		}
	};
	return manage;
})();

_cAsync.tool = _cAsync.fn.tool = (function(){
	var tool,
		manage,
		config = {
			size : {
				precise : 	5,
				unit 	: 	{ T : "TB" , G : "GB" , M : "MB" , K : "KB" , B : "B" }
			},
			date : {
				polish 	: 	true,
				time 	: 	"-",
				date 	: 	":"
			}
		},
		c_size = {
			KB : 1024,
			MB : 1024 * 1024,
			GB : 1024 * 1024 * 1024,
			TB : 1024 * 1024 * 1024 *1024
		};
	tool = {
		config : function( args , type ){
			for( var a in args ){
				if( config[ type ].hasOwnProperty( a ) ){
					config[ type ][ a ] = args[ a ];
				};
			};
		},
		sort : function( array , func ){
			var _x = function( num ){
				var _s = [],
					_b = [],
					_tmp = num[ 0 ],
					__tmp;
				for(var i = 1 , len = num.length; i < len; i++){
					__tmp = num[ i ];
					if( func( __tmp , _tmp ) ){
						_s.push( __tmp );
					} else {
						_b.push( __tmp );
					};
				};
				if( _s.length > 1 ){ 
					_s = _x( _s ); 
				} else if( !_s.length ){
					if( _b.length > 1 ){
						return [ _tmp ].concat( _x( _b ) );
					} else {
						return [ _tmp , _b[ 0 ] ];
					};
				};
				if( _b.length > 1 ){ 
					_b = _x( _b ); 
				} else if( !_b.length ){
					if( _s.length > 1 ){
						return _s.concat( [ _tmp ] );
					} else {
						return [ _s[ 0 ] , _tmp ];
					};
				};
				_s.push( _tmp );
				return _s.concat( _b );
			};
			return _x( array );
		},
		date_tostring : function( time , args ){
			var _date = ( time instanceof Date ) ? time : new Date( time * 1000 ),
				_tmp = {
					_Y : _date.getFullYear(),
					_M : _date.getMonth() + 1,
					_D : _date.getDate(),
					_h : _date.getHours(),
					_m : _date.getMinutes(),
					_s : _date.getSeconds()
				};
			args.polish = args.polish === undefined ? config.date.polish : args.polish;
			if( args.polish ){
				for( var a in _tmp ){
					_tmp[ a ] = _tmp[ a ] < 10 ? ( "0" + _tmp[ a ] ) : _tmp[ a ];
				};
			};
			return [ _tmp._Y , _tmp._M , _tmp._D ].join( ( args.time || config.date.time ) ) + " " + [ _tmp._h , _tmp._m , _tmp._s ].join( ( args.date || config.date.date ) );
		},
		tsize_tostring : function( size , args ){
			var _str 	= size,
				_unit 	= typeof args.unit === "object" ? (function(){
					var _u = config.size.unit;
					for( var a in args.unit ){
						_u[ a ] = args.unit[ a ];
					};
					return _u;
				})() : config.size.unit,
				_pos = 1,
				_x = function( type ){
					if( args.precise ){
						_str = Math.floor( size / c_size[ type + "B" ] );
						_str = _str + _unit[ type ] + tool.tsize_tostring( size - _str * c_size[ type + "B" ] , args );
					} else {
						_str = Math.ceil( size / c_size[ type + "B" ] ) + _unit[ type ];
					};
					return _str;
				};
			if( size < 0 ){
				size = -1 * size;
				_pos = 0;
			};
			args.precise = args.precise || config.size.precise;
			args.precise--;
			if( size >= c_size.KB ){
				if( size >= c_size.MB ){
					if( size >= c_size.GB ){
						if( size >= c_size.TB ){
							_str = _x( "T" );
						} else {
							_str = _x( "G" );
						};
					} else {
						_str = _x( "M" );
					};
				} else {
					_str = _x( "K" );
				};
			} else {
				_str += _unit.B;
			};
			return _pos ? _str  : ( "-" + _str );
		},
		tsize_toint : function( str ){
			str = str.toUpperCase();
			var _size = str.replace( /[TB|GB|MB|KB|B|K|M|G|T]+$/g , "" );
			if( str.indexOf("KB") != -1 || str.indexOf("K") != -1 ){
				_size = _size * c_size.KB;
			} else if( str.indexOf("MB") != -1 || str.indexOf("M") != -1 ){
				_size = _size * c_size.MB;
			} else if( str.indexOf("GB") != -1 || str.indexOf("G") != -1){
				_size = _size * c_size.GB;
			} else if( str.indexOf("TB") != -1 || str.indexOf("T") != -1 ){
				_size = _size * c_size.TB;
			};
			return Math.ceil( _size );
		},
		JIT : function( json , modal_str , replace ){
			var _str = [];
			if( !modal_str ){
				var _count = 0;
				for(var a in json){
					_str[_count] = " ; ";
					_count++;
					_str[_count] = a;
					_count++;
				};
			} else {
				_str = modal_str.split("==");
			};
			for(var i = 0 , len = _str.length ; i < len; i++){
				if( ( i % 2 ) ){
					if( json.hasOwnProperty(_str[i]) ){
						_str[i] = json[_str[i]];
					} else if( replace !== undefined ){
						_str[ i ] = replace;
					};
				};
			};
			return _str.join("");
		},
		/*!
		 *	解决在JQ1.9 版本后 移除 browser后的bug
		 */
		fixed_browser : function(){
			var _version = window.navigator.appVersion;
			if( _version.indexOf( "Chrome" ) !== -1 ){
				$.fn.browser = { chrome : true , version : _version.replace( /.*Chrome\/(.*)\s.*/gi , "$1" ) };
			} else if( window.navigator.appName === "Microsoft Internet Explorer" && _version.indexOf( "MSIE" ) !== -1 ){
				$.fn.browser = { msie : true , version : parseInt( _version.replace( /.*MSIE([^;]*).*/gi , "$1" ) ) };
			} else if( window.navigator.mozApps ){
				$.fn.browser = { mozilla : true , version : 1 };
			} else {
				$.fn.browser = {};
			};
			$.browser = $.fn.browser;
		}
	};
	manage = {
		/*!
		 *	type : date | size
		 */
		config : function( args , type ){
			if( !type || !config[ type ] ){ return false; };
			tool.config( args , type );
		},
		uniqueid : function(){
			return ( ( new Date() ).getTime() + "" + Math.ceil( Math.random() * 1000000 ) );
		},
		/*!
		 *	解决JS在v8引擎  sort不稳定的bug
		 *	内置 快速排序
		 *	func( a , b ){ return true | false };
		 */
		sort : function( array , func ){
			if( !array || !( array instanceof Array ) ){ return false; };
			if( !func || typeof( func ) !== "function" ){ return array; };
			return tool.sort( array , func );
		},
		/*!
		 *	args = {
				polish : true | false,
				日期部分 填充
				time : str,
				时分秒部分 填充
				date : str
		 	}
		 */
		date : function( time , args ){
			time = time || new Date();
			if( !args || typeof( args ) !== "object" ){ 
				args = {};
			};
			if( $.isNumeric( time ) ){
				return tool.date_tostring( time , args );
			} else if( time instanceof Date ){
				return tool.date_tostring( time , args );
			};
		},
		tsize : function( size , args ){
			args = typeof args !== "object" ? {} : args;
			if( $.isNumeric( size ) ){
				return tool.tsize_tostring( size , args );
			} else {
				return tool.tsize_toint( size , args );
			};
		},
		JIT : function( json , modal_str , replace ){
			if( !json || typeof( json ) !== "object" ){return false;};
			return tool.JIT( json , modal_str , replace );
		},
		is_html : function( node ){
			if( !node || typeof( node ) !== "object" ){ return false; };
			if( ( node[ "nodeType" ] || manage.has_property( node , "nodeType" ) ) && typeof node.nodeType === "number" ){
				return true;
			};
			return false;
		},
		is_css : function( node ){
			if( !node || typeof( node ) !== "object" ){ return false; };
			if( manage.has_property( node , "cssText" ) && manage.has_property( node , "parentRule" ) ){
				return true;
			};
			return false;
		},
		has_property : function( node , name ){
			if( $.browser && $.browser.msie ){
				return Object.prototype.hasOwnProperty.call( node , name );
			} else {
				return node.hasOwnProperty( name );
			};
		},
		rtn : function(){
			var _t = {},
				_deep,
				_len = arguments.length,
				_k;
			if( _len >= 1 ){
				for( var i = 0; i < _len; i++ ){
					if( arguments[ i ] instanceof jQuery || manage.is_html( arguments[ i ] ) ){
						_k = 1;
						while( _k ){
							if( !_t[ _k ] ){
								_t[ _k ] = arguments[ i ];
								break;
							};
							_k++;
						};
					} else if( typeof( arguments[ i ] ) === "object" ){
						for( var a in arguments[ i ] ){
							_deep = arguments[ i ][ a ];
							if( _deep && typeof( _deep ) === "object" && !( _deep instanceof Array ) && !( _deep instanceof jQuery ) && !manage.is_html( _deep ) && !manage.is_css( _deep ) ){
									_t[ a ] = manage.rtn( _deep );
							} else {
								_t[ a ] = _deep;
							};
						};
					};
				};
			};
			return _t;
		}
	};
	if( !$.browser ){ tool.fixed_browser(); };
	return manage;
})();

_cAsync.doc = _cAsync.fn.doc = (function(){
	var tool,
		ui,
		manage;
	ui = {
		doc : false,
		length : 0
	};
	tool = {
		event : {
			resize : function(){
				jQuery( window ).resize( function(){
					window.setTimeout( function(){
						manage.width = jQuery( window ).width();
						manage.height = jQuery( window ).height();
						tool.resize();
					} , 10 );
				});
			}
		},
		exsit : function( modal ){
			var _id = modal.modal.attr( "c_resize_id" );
			if( !_id ){
				return false;
			} else {
				return true;
			};
		},
		clear_resize : function( modal ){
			var _id = modal.modal.attr( "c_resize_id" );
			for( var i = ui.length + 1; i--; ){
				if( ui[ i ] && ui[ i ].__id == _id ){
					ui[ i ] = false;
				};
			};
		},
		set : function( args ){
			var _modal;
			if( args.type === "add" ){
				for(var i = 0 , len = args.set.length; i < len; i++){
					_modal = args.set[ i ];
					if( typeof( _modal ) !== "object" || !_modal.modal || !( _modal.modal instanceof jQuery ) || tool.exsit( _modal ) ){ continue; }
					_modal.__id = _cAsync.tool.uniqueid();
					_modal.modal.attr( "c_resize_id" , _modal.__id );
					ui[ ++ui.length ] = _modal;
					if( args.excute ){
						tool.resize_single( _modal );
					};
				};
			} else if( args.type === "clear" ){
				for(var i = 0 , len = args.set.length; i < len; i++){
					_modal = args.set[ i ];
					if( typeof( _modal ) !== "object" || !_modal.modal || !( _modal.modal instanceof jQuery ) || !tool.exsit( _modal ) ){ continue; }
					tool.clear_resize( _modal );
				};
			};
		},
		resize_single : function( modal ){
			if( !modal.modal ){
				modal = false;
				return false;
			};
			if( modal.doc && !ui.doc ){
				_cAsync.doc.layout();
				modal.doc = true;
			};
			if( modal.width ){
				modal.width( modal.modal , manage.width , manage.height );
			};
			if( modal.height ){
				modal.height( modal.modal , manage.width , manage.height );
			};
		},
		resize : function(){
			ui.doc = false;
			for(var i = 0; i <= ui.length; i++){
				if( ui[ i ] ){
					tool.resize_single( ui[ i ] );
				};
			};
		},
		init : function(){
			tool.event.resize();
		}
	};
	manage = {
		width : document.width || document.documentElement.clientWidth,
		height : document.height || document.documentElement.clientHeight,
		/*!
		 args = {
			set : [ {
				modal : JQDOM,
				width : func( modal , width , height ){},
				height : func( modal , width , height ){}
			} ],
			//	是否马上执行resize事件
			excute : false,
			// 是否适配到 全局上
			doc : true | false,
			type : "add|clear"
		 } 
		 */
		resize : function( args ){
			if( !args ){
				tool.resize();
			} else if( args.set ){
				if( !args.type ){ args.type = "add"; };
				args.excute = args.excute === undefined ? true : args.excute;
				if( !( args.set instanceof Array ) ){
					args.set = [ args.set ];
				};
				tool.set( args );
			};
			return false;
		},
		/*!
		 *	制作富客户端应用时 提供撑开body高度 100%的问题
		 args = {
			auto : true
		 };
		 */
		layout : function( args ){
			var _height = "height";
			if( args ){
				if( args.auto ){
					jQuery("body").addClass("c_layout_box");
				};
				if( args.min ){
					_height = "min-" + _height;
				};
			};
			jQuery("body").css( _height , manage.height );
			return false;
		}
	};
	tool.init();
	return manage;
})();

_cAsync.alert = _cAsync.fn.alert = (function(){
	var init = false,
		tool,
		global_config,
		manage,
		html,
		ui,
		win_event,
		alert,
		inner = {
			theme : { "default" : 1 , primary : 1 , success : 1 , info : 1 , warning : 1 , danger : 1 , "new" : 1 , off : 1 }
		};
	global_config = {
		/*	是否允许最大化	*/
		max_able 		: 	false,
		/*	是否允许最小化	*/
		min_able 		: 	false,
		/*	主题样式	*/
		theme 			: 	"default",
		/*	提示框持续时间	*/
		msg_keep_time 	: 	1500,
		width 			: 	"30%",
		height 			: 	false,
		/*	是否提供动画支持 	*/
		animate 		: 	false,
		/*!
		 *	设置对话框 弹出动画方式  a,b
		 */ 
		animate_type 	: 	"a",
		/*	动画持续时间	*/
		animate_time 	: 	1000,
		/*	是否可拖动	*/
		drag 			: 	false,
		default_zindex 	: 	1999,
		initialize 		: 	[],
		close 	 		: 	[],
		callback 		: 	[],
		min 	 		: 	[],
		max 			: 	[],
	};
	
	alert = function( args , id ){
		var _config = _cAsync.tool.rtn( args ),
			_manage = {},
			_ui,
			_tool,
		_tool = {
			data : {
				/*!
				 *	解决出现滚动条时  依然可以居中
				 */
				get_top_height : function(){
					var _t = _config.top;
					if( _t.indexOf( "%" ) != -1 ){
						_t = parseInt( _t.replace( /\%/ , "" ) );
						_t = Math.ceil( _t / 100 * ( _config.containter.height() > $c.doc.height ? $c.doc.height : _config.containter.height() ) );
					} else {
						_t = _t.replace( /p?x?/ , "" );
						_t = parseInt( _t );
					};
					_t += _config.containter[ 0 ].tagName === "BODY" && $.browser.mozilla ? $( "html" ).scrollTop() : _config.containter.scrollTop();
					return _t;
				},
				delete_self : function(){
					var _nodes = _config.containter[ 0 ].childNodes,
						_del = true;
					if( _config.keep ){
						_config.modal.css({ "z-index" : -1 , visibility : "hidden" });
					} else {
						_config.modal.remove();
						if( ui.keep_alerts_list[ _config.__id ] ){
						 	delete ui.keep_alerts_list[ _config.__id ];
						};
						delete ui.alerts[ _config.__id ];
						for( var a in _manage ){
							delete _manage[ a ];
						};
					};
					for( var i = _nodes.length; i--; ){
						if( _nodes[ i ].tagName === "DIV" && 
							_nodes[ i ].className.indexOf( "c_alert_modal_layout" ) !== -1 && 
							_nodes[ i ].style.visibility !== "hidden" ){
							_del = false;
							break;
						};
					};
					if( _del ){
						_config.containter.removeClass( "c_alert_modal_show" );
						_config.containter.find( ".c_alpha_modal" ).eq( 0 ).height( 0 ).width( 0 );
					};
					tool.data.after_delete_alert( _config );
				},
				check_config : function(){
					_config = _cAsync.tool.rtn( _config , {
						__id 			: 	id,
						__theme 		: 	args.theme || global_config.theme,
						containter 		: 	args.containter instanceof jQuery ? _tool.ui.set_containter( args.containter ) : ui.body,
						id 				: 	args.id || id,
						keep 			: 	args.keep ? true : false,
						title 			: 	args.title || "信息",
						content 		: 	args.content || "content为必填项！",
						width 			: 	args.width || global_config.width,
						height 			: 	args.height || global_config.height,
						top 			: 	args.top || ( alert.length + 9 ) + "%",
						left 			: 	0,
						z_index 		: 	tool.data.get_current_alert() !== undefined ? ( tool.data.get_current_alert( true ).z_index + 1 ) : global_config.default_zindex,
						manage 			: 	_manage,
						initialize 		: 	args.initialize || function(){ return true; },
						close 			: 	args.close || ( _config.keep ? function(){ return false;} : function(){ return true; } ),
						callback 		: 	args.callback || false,
						min_able 		: 	args.min_able === undefined ? global_config.min_able : args.min_able,
						max_able 		: 	args.max_able === undefined ? global_config.max_able : args.max_able,
						modal 			: 	0,
						alert_modal 	: 	0,
						header 			: 	0,
						article 		: 	0,
						animate 		: 	( args.animate === undefined ) ? global_config.animate : args.animate,
						animate_type 	: 	args.animate_type || global_config.animate_type,
						animate_time 	: 	args.animate_time || global_config.animate_time,
						display 		: 	true,
						drag 			: 	( args.drag === undefined ) ? global_config.drag : args.drag,
						ui_size 		: 	{ big : false }
					} );
					_config.left = args.left || _tool.ui.set_alert_left();
					if( _config.keep ){
						ui.keep_alerts_list[ _config.__id ] = _config;
					};
				}
			},
			event : {
				min : function(){
					_config.keep = true;
					_config.display = false;
					_tool.data.delete_self();
					if( _config.min ){
						_config.min( _config.alert_modal , _manage );
					};
				},
				/*!
				 *	to_small 	: 	boolean 
				 *	true 		: 	由大变小
				 *	false 		: 	由小变大
				 */
				max : function( to_small ){
					if( !to_small && !_config.ui_size.big ){
						_config.ui_size = {
							big 	: 	true,
							width 	: 	_config.width,
							height 	: 	_config.height,
							left 	: 	_config.left,
							top 	: 	_config.top
						};
						_config.width 	= 	"100%";
						_config.height 	= 	_cAsync.doc.height;
						_config.left 	= 	"0";
						_config.top 	= 	"0";
						_config.header.find("[func='max']").html( "□" );
					} else {
						_config.ui_size.big = false;
						_config.width 	= 	_config.ui_size.width;
						_config.height 	= 	_config.ui_size.height || "auto";
						_config.left 	= 	_config.ui_size.left;
						_config.top 	= 	_config.ui_size.top;
						_config.header.find("[func='max']").empty();
					};
					_tool.ui.resize();
					_tool.ui.max();
					if( _config.max ){
						_config.max( _config.alert_modal , _manage , _config.ui_size.big );
					};
				},
				drag : function(){
					var _move_able = false,
						_x,
						_y,
						_ev = ( $.browser.msie ) ? 1 : 0,
						_time = new Date();
					_config.alert_modal.find("[func='title_area']").eq( 0 ).mousedown(function( e ){
						e = e || window.event;
						if( e.button == _ev ){
							_config.alert_modal.addClass("drag");
							_move_able = true;
							_x = e.pageX;
							_y = e.pageY;
							_config.modal.unbind( "mousemove" ).mousemove(function( e ){
								var _l,
									_t,
									_offset,
									_os = _config.containter.offset();
									__time = new Date();
								e = e || window.event;
								if( e.button == _ev && _config.alert_modal && _move_able && __time - _time > 10 ){
									_offset = _config.alert_modal.offset();
									_offset.left -= _os.left;
									_offset.top -= _os.top;
									_l = ( e.pageX - _x + _offset.left );
									_t = ( e.pageY - _y + _offset.top );
									_x = e.pageX;
									_y = e.pageY;
									_config.alert_modal.css({
										left : _l,
										top : _t
									});
									_time = __time;
								};
								return false;
							});
						};
						return false;
					}).mouseup(function( e ){
						_config.alert_modal.removeClass("drag");
						_config.modal.unbind( "mousemove" );
						_move_able = false;
						return false;
					});
					_config.modal.dblclick(function(){
						var _l = _tool.ui.set_alert_left(),
							_t = _tool.data.get_top_height();
						
						if( _config.alert_modal.css("left").replace( /px/g , "" ) == _l  && _config.alert_modal.css("top").replace( /px/g , "" ) == _t ){ return false; };
						_config.alert_modal.animate({
							width 			: _config.width,
							"left" 			: _l,
							"top" 			: _t
						} , 500 );
						return false;
					}).mouseup(function(){
						_config.alert_modal.removeClass("drag");
						_move_able = false;
						return false;
					});
				},
				init : function(){
					if( _config.__theme == "off" ){
						_config.modal.click(function( e ){
							var _t = jQuery( e.target );
							if( !_t.parents(".c_alert_modal").length ){
								_manage.close();
							};	
						});
					};
					_config.alert_modal.find("[func='sure']").unbind("click").click(function(){
						_manage.callback();
					});
					_config.alert_modal.find("[func='close']").unbind("click").click(function(){
						_manage.close( !_config.keep );
					});
					_config.header.find("[func='min']").unbind("click").click(function(){
						_tool.event.min();
					});
					_config.header.find("[func='max']").unbind("click").click(function(){
						_tool.event.max();
					});
					if( _config.drag ){
						_tool.event.drag();
					};
					_config.initialize( _config.article , _manage );
				}
			},
			ui : {
				set_containter : function( modal ){
					var _nodes = modal[ 0 ].childNodes,
						_add = true;
					for( var i = _nodes.length; i--; ){
						if( _nodes[ i ].tagName === "DIV" && _nodes[ i ].className === "c_alpha_modal" ){
							_add = false;
							break;
						};
					};
					if( _add ){ modal.addClass( "c_alert" ).append( "<div class='c_alpha_modal'></div>" ); };
					return modal;
				},
				max : function(){
					var _article = _config.alert_modal.find("[func='article']").eq( 0 ),
						_h = _cAsync.doc.height - 73;
					if( _config.ui_size.big ){
						if( _article.height() < _h ){
							_article.height( _h );
						};
					} else {
						_article.height( "auto" );
					};
				},
				resize : function(){
					_config.alert_modal.css({
						width 	: 	_config.width,
						height 	: 	_config.height,
						left 	: 	_config.left,
						top 	: 	_config.top
					});
				},
				animate_show : function(){
					var _h;
					if( _config.animate_type === "b" ){
						_h = _config.alert_modal.height();
						_config.alert_modal.css({
							top : "50%",
							left : "50%",
							width : 0
						}).animate({
							top : _tool.data.get_top_height(),
							width : _config.width,
							left : _tool.ui.set_alert_left()
						} , _config.animate_time );
					} else {
						_config.alert_modal.animate({
							"top" 			: _tool.data.get_top_height()
						} , _config.animate_time );
					};
				},
				set_animate : function(){
					if( _config.animate ){
						_config.containter.append( _config.modal );
						_tool.ui.animate_show();
					} else {
						_config.alert_modal.css({
							"top" 	: _tool.data.get_top_height(),
							"left" 	: _tool.ui.set_alert_left(),
						});
						_config.containter.append( _config.modal );
					};
				},
				set_theme_ui : function(){
					var _class,
						_close_btn;
					if( _config.__theme == "off" ){ 
						_config.modal.find("[func='alert_modal']").addClass("off_theme");
					} else if( _config.theme !== global_config.theme ){
						_class = _config.modal.find("[func='alert_modal']").attr("class").replace( /c_theme_.+/g , "" );
						_class += " c_theme_" + _config.__theme;
						_config.modal.find("[func='alert_modal']").attr( "class" , _class );
						_close_btn = _config.alert_modal.find("b.close");
						if( _config.__theme == "new" ){
							_close_btn.empty();
						} else {
							_close_btn.html( "X" );
						};
					};
					if( _config.min_able && _config.theme !== "off" ){
						_close_btn.after( "<b class='min' func='min'></b>" );
					};
					if( _config.max_able && _config.theme !== "off" ){
						_close_btn.after( "<b class='max' func='max'></b>" );
					};
				},
				set_alert_left : function(){
					var _l;
					_config.width += "";
					if( _config.width.indexOf("%") !== -1 ){
						_l = _config.width.replace( /\%/g , "" );
						_l = ( 100 - _l ) / 200 * _config.containter.width();
					} else {
						_l = ( _cAsync.doc.width - _config.width ) / 2; 
					};
					return _l;
				},
				set_overby : function(){
					if( _config.containter[ 0 ].scrollHeight ){
						_config.modal.height( _config.containter[ 0 ].scrollHeight ).siblings( ".c_alpha_modal" ).height( _config.containter[ 0 ].scrollHeight );
					};
					if( _config.containter[ 0 ].scrollWidth ){
						_config.modal.width( _config.containter[ 0 ].scrollWidth ).siblings( ".c_alpha_modal" ).width( _config.containter[ 0 ].scrollWidth );
					};
				},
				set_html_into_body : function(){
					_config.modal 		= 	jQuery( html.alert );
					_config.alert_modal = 	_config.modal.find("[func='alert_modal']");
					_config.article 	= 	_config.alert_modal.find(".c_article[func='article']");
					_config.header 		= 	_config.alert_modal.find("h3[func='title_area']");
					_config.alert_modal.find("[func='title']").text( _config.title );
					_config.article.html( _config.content );
					_config.alert_modal.css({
						width 		: 	_config.width,
						height 		: 	_config.height,
						left		: 	_config.left
					}).attr({
						_id 		: 	id
					});
					_tool.ui.set_animate();
					tool.event.excute( _config.article , _manage , "initialize" );
					_tool.ui.set_theme_ui();
					if( !_config.callback ){ _config.modal.find(".c_footer").remove(); };
					_config.modal.css({
						"z-index" : _config.z_index
					});
					_tool.ui.set_overby();
				}
			},
			init : function(){
				_tool.data.check_config();
				_config.containter.addClass( "c_alert_modal_show" );
				_tool.ui.set_html_into_body();
				_tool.event.init();
			}
		};
		_manage = {
			theme : function( theme ){
				var _theme;
				if( !theme || !inner.theme[ theme ] ){ return false; };
				_config.__theme = theme;
				_theme = _config.alert_modal[ 0 ].className.replace( /c_theme_([^\s]*)/ig , "c_theme_" + theme );
				_config.alert_modal[ 0 ].className = _theme;
				return _manage;
			},
			max : function(){
				tool.event.excute( _config.article , _manage , "max" );
				_tool.event.max();
				return _manage;
			},
			min : function(){
				tool.event.excute( _config.article , _manage , "min" );
				_tool.event.min();
				return _manage;
			},
			/*!
			args = {
				width : int || "int%",
				height : int || "int%",
				left : int || "int%",
				top : int || "int%"
			};
			 */
			size : function( args ){
				var _type = { width : 1 , height : 1 , left : 1 , top : 1 },
					_change = false;
				if( !args || typeof args !== "object" ){ return false; };
				for( var a in args ){
					if( _type[ a ] ){
						_config[ a ] = args[ a ];
						_change = true;
					};
				};
				if( _change ){
					_tool.ui.resize();
				};
				return _manage;
			},
			title : function( str ){
				if( !str || typeof str !== "string" ){ 
					return _config.title; 
				} else {
					_config.title = str;
					_config.alert_modal.find("[func='title_area'] [func='title']").text( str );
				};
				return _manage;
			},
			info : function(){
				return _config;
			},
			clear : function( func ){
				_config.keep = false;
				_tool.data.delete_self( true );
				_config.modal.remove();
				return false;
			},
			show : function(){
				if( !_config.display || !_config.keep ){
					ui.alerts.length++; 
				};
				_config.display = true;
				_config.containter.addClass("c_alert_modal_show");
				_config.z_index = tool.data.get_current_alert() ? tool.data.get_current_alert( true ).z_index + 1 : 2000;
				_config.modal.css({ "z-index" : _config.z_index , visibility : "visible"});
				if( _config.animate ){
					_tool.ui.animate_show();
				};
				return _manage;
			},
			/*!
			 *	is_clear : true/false
			 *	true : 不关心 传入args.close( modal )方法的返回值 关闭
			 *	false : 如果 args.close( modal ) 返回值为false 阻止关闭
			 */
			callback : function( is_clear ){
				tool.event.excute( _config.article , _manage , "callback" );
				if( !_config.callback ){
					return false;
				} else if( _config.callback( _config.article , _manage ) || is_clear ){
					_tool.data.delete_self();
				};
			},
			/*!
			 *	is_clear : true/false
			 *	true : 不关心 传入args.close( modal )方法的返回值 关闭
			 *	false : 如果 args.close( modal ) 返回值为false 阻止关闭
			 */
			close : function( is_clear ){
				if( is_clear ){
					_config.close( _config.article , _manage );
				} else {
					if( _config.close( _config.article , _manage ) ){
						_config.keep = false;
					};
				};
				_config.display = false;
				tool.event.excute( _config.article , _manage , "close" );
				_tool.data.delete_self();
				return _manage;
			}
		};
		_tool.init();
		this.manage = _manage;
		this.config = _config;
		return _manage;
	};
	
	ui = {
		body	: 0,
		msg		: 0,
		keep_alerts_list : {
			current : 0
		},
		alerts 	: {
			length : 0,
			max_length : 0
		}
	};
	
	html = {
		alpha 	: 0,
		alert 	: 0,
		loading	: 0
	};
	
	tool = {
		data : {
			z_index : function(){
				for( var a in ui.alerts ){
					if( typeof ui.alerts[ a ] === "object" ){
						ui.alerts[ a ].info().z_index = global_config.default_zindex;
					};
				};
			},
			after_delete_alert : function( alert ){
				if( !alert.keep ){
					delete ui.alerts[ alert.id ];
				};
			},
			get_current_alert : function( detail ){
				var _i = 0,
					_count = 0,
					_id,
					_z,
					_max_z = 0,
					_max_alert,
					_alert;
				for( var i = ui.alerts.max_length + 1; --i; ){
					if( _alert = ui.alerts[ "alert_" + i ] ){
						_alert = _alert.info();
						if( !_alert.display ){ continue; };
						_z = _alert.z_index;
						if( _max_z < _z ){
							_max_z 		= _z;
							_id 		= _alert.__id;
							_max_alert 	= _alert;
						};
					};
				};
				return detail ? _max_alert : _id;
			}
		},
		event : {
			/*!
			 *	执行 全局配置中对应的 事件
			 */
			excute : function( modal , manage , type ){
				var _funcs;
				if( _funcs = global_config[ type ] ){
					for( var i = _funcs.length; i--; ){
						if( _funcs[ i ]( modal , manage ) ){ return true; };
					};
				};
				return false;
			},
			key_event : function(){
				win_event = _cAsync.tool.rtn( window.onkeyUp );
				jQuery( document ).keyup( function( e ){
					e = e || window.event;
					e.keyCode = e.keyCode || e.which;
					var _id = tool.data.get_current_alert();
					if( !ui.alerts[ _id ] ){ return false; };
					if( e.keyCode === 27 ){
						ui.alerts[ _id ].close();
					} else if( e.keyCode === 13 ){
						if( ui.alerts[ _id ].callback ){
							ui.alerts[ _id ].callback();
						};
					};
					if( ui.alerts.length === 0 ){
						window.onkeyup = win_event;
					};
					return true;
				} );
			}
		},
		ui : {
			reset_theme : function( theme ){
				var _close = theme === "new" ? "" : "X";
				if( !inner.theme[ theme ] ){ 
					_theme = "c_theme_default"; 
				} else {
					_theme = "c_theme_" + theme; 
				};
				html.alert = '<div class="c_alert_modal_layout">\
								<div class="c_alert_modal ' + _theme + '" func="alert_modal">\
									<h3 func="title_area">\
										<div class="c_over"></div>\
										<span func="btns"><b class="close" func="close">' + _close + '</b></span>\
										<b func="title"></b>\
									</h3>\
									<div class="c_article" func="article"></div>\
									<div class="c_footer">\
										<div class="c_over"></div>\
										<a class="btn" func="close">返回</a>\
										<a class="btn" func="sure">确定</a>\
									</div>\
								</div>\
							</div>';
			},
			set_alert : function( args ){
				var _id = "alert_" + ( ++ui.alerts.max_length );
				ui.alerts.length++;
				ui.alerts[ _id ] = new alert( args , _id );
				if( args.keep && args.id ){
					ui.keep_alerts_list[ args.id ] = _id;
				};
			},
			set_html : function(){
				if( $.browser && $.browser.msie ){ jQuery("body").addClass("c_ie_ui"); };
				html.alpha = '<div class="c_alpha_modal"></div>';
				html.loading = "<div class='c_loading_modal'></div>";
				html.msg = "<div class='c_msg_modal' func='msg'>loading</div>";
				ui.msg = jQuery( html.msg );
				ui.body = jQuery("body");
				ui.body.append( html.alpha + html.loading ).append( ui.msg );
				ui.body.addClass( "c_alert" );
				tool.ui.reset_theme( global_config.theme );
				init = true;
				tool.event.key_event();
			}
		}
	};
	
	return manage = {
		config : function( args ){
			var _type = { initialize : 1 , close : 1 , callback : 1 , min : 1 , max : 1 };
			if( !args || typeof( args ) !== "object" ){ return false;};
			for(var a in args){
				if( _type[ a ] ){
					if( typeof args[ a ] === "function" ){ 
						args[ a ] = [ args[ a ] ]; 
					} else if( !( args[ a ] instanceof Array ) ){
						continue;
					};
					for( var i = args[ a ].length; i--; ){
						if( typeof args[ a ][ i ] === "function" ){
							global_config[ a ].push( args[ a ][ i ] );
						};
					};
				} else if( global_config.hasOwnProperty( a ) ){
					global_config[ a ] = args[ a ];
					if( a == "theme" ){
						tool.ui.reset_theme( args[ a ] );
					};
				};
			};
			return manage;
		},
		id : function( name ){
			if( !name || typeof( name ) !== "string" || !ui.keep_alerts_list[ name ] || !ui.alerts[ ui.keep_alerts_list[ name ] ] ){ return false; };
			return ui.alerts[ ui.keep_alerts_list[ name ] ];
		},
		clear : function(){
			var _id;
			window.setTimeout( function(){
				for(var i = 1; i <= ui.alerts.max_length; i++){
					_id = "alert_" + i;
					if( ui.alerts[ _id ] ){
						ui.alerts[ _id ].close( true );
					};
				};
			} , 5 );
			if( ui.alerts.length ){
				manage.unset();
			};
		},
		/*!
		 *	clear : true|false
		 *	true 忽略页面上存在的alert页面 直接执行unset命令
		 *	false ：如果页面上还存在 弹出框时 不执行隐藏
		 */
		unset : function( clear ){
			if( clear ){
				ui.body.removeClass("c_alpha_modal_show c_loading_modal_show c_msg_modal_show c_alert_modal_show");
			} else {
				if( ui.alerts.length <= 0 ){
					ui.body.removeClass("c_alpha_modal_show c_loading_modal_show c_msg_modal_show c_alert_modal_show");
				} else {
					ui.body.removeClass("c_alpha_modal_show c_loading_modal_show c_msg_modal_show");
				};
			};
		},
		/*!
		args = {
			title 		: 	str,
			content 	: 	html,
			containter  : 	JQDOM,
			width 		: 	"int | int%",
			height 		: 	"int | int%",
			top 		: 	"int | int%",
			id 			: 	str,
			keep 		: 	boolean,
			theme 		: 	"a | b ",
			drag 		: 	boolean,
			animate 	: 	boolean,
			animate_time: 	int,
			animate_type: 	"a | b ",
			min_able 	: 	boolean,
			max_able 	: 	boolean,
			min 		: 	func( modal , _manage ),
			max 		: 	func( modal , _manage , to_big ),
			initialize 	: 	func( modal , _manage ),
			close 		: 	func( modal , _manage ),
			callback 	: 	func( modal , _manage )
		};
		delay : int,
		msg_keep_time : int
		 */
		set : function( args , delay ){
			var _args = arguments,
				_x = function(){
				if( !init ){ tool.ui.set_html();};
				if( !args ){
					ui.body.addClass("c_loading_modal_show");
				} else if( typeof( args ) === "string" || typeof args === "number" ){
					ui.msg.html( args );
					ui.msg.css( "top" , jQuery( document ).scrollTop() + ( _cAsync.doc.height * 0.75 ) );
					ui.body.addClass("c_msg_modal_show");
					window.setTimeout( function(){ manage.unset(); } , 
						( _args[ 2 ] && ( typeof _args[ 2 ] === "number" ) ) ? _args[ 2 ] : global_config.msg_keep_time 
					);
				} else if( typeof( args ) === "object" ){
					tool.ui.set_alert( args );
				};
			};
			if( delay && $.isNumeric( delay ) ){
				window.setTimeout( function(){ _x(); } , delay );
			} else {
				_x();
			};
		}
	};
})();

_cAsync.fn.extend({
	modal : (function(){
		var tool,
			manage,
			require,
			config,
			require_list = {
				urls 	: [],
				length 	: 0
			};
		config = {
			wait : 0
		};
		require = function( args , id ){
			var _config = {
					__input 		: _cAsync.tool.rtn( args ),
					__id 			: id,
					__state 		: "loading",
					__done 			: false,
					__url 			: args.url,
					__callback		: args.callback,
					__order 		: args.order || false,
					__count 		: args.order ? args.url.length : 0,
					/*!
					 *	维护当前 请求的条目索引
					 */
					__order_index 	: 0
				},
				_reg = {
					page 	: 	/.*\.(html?|jsp|php|aspx?)$/i,
					js 		: 	/.*\.js$/i,
					img 	:  	/.*\.(jpe?g|png|bmp)$/i,
					css 	: 	/.*\.css$/i
				},
				_tool,
				_manage;
			_tool = {
				callback : function( url ){
					if( args.wait ){
						_cAsync.alert.unset();
					};
					_config.__order_index++;
					if( _config.__order && _config.__order_index < _config.__url.length ){ this.order(); };
					if( --_config.__count <= 0 && args.callback ){
						_config.__state = "completed";
						args.callback();
					};
				},
				require_other : function( url ){
					var _form = document.createElement("form");
					_form.target = "_blank";
					_form.action = url;
					_form.method = "post";
					_form.style.visibility = "hidden";
					_form.style["z-index"] = -1;
					document.body.appendChild( _form );
					_form.submit();
					_tool.callback( url );
					_form.outerHTML = null;
				},
				require_img : function( url ){
					var _img = document.createElement("img");
					_img.src = url;
					_img.onload = function(){
						_tool.callback( url );
					};
				},
				require_css : function( url ){
					var _link = document.createElement("link"),
						_head = document.head || document.getElementsByTagName("head")[ 0 ];
					_link.rel 	= "stylesheet";
					_link.href 	= url;
					_head.appendChild( _link );
					_link.onload = function(){
						_tool.callback( url );
					};
				},
				require_js : function( url ){
					var _script = document.createElement("script");
					_script.type = "text/javascript";
					_script.src = url;
					document.body.appendChild( _script );
					if( $.browser && $.browser.msie ){
						_script.onreadystatechange = function(){
							if( _script.readyState == "complete" || _script.readyState == "loaded" ){
								_tool.callback( url );
							};
						};
					} else {
						_script.onload = function(){
							_tool.callback( url );
						};
					};
				},
				require_page : function( url ){
					var _first = true,
						_t,
						_state = "loading",
						x = function(){
							if( _first ){
								_t = 50 + require_list.lenght * 15;
							} else {
								_t = 50;
							};
							window.setTimeout( function(){
								if( _state !== "ready" ){
									try{
										$.get( url , function( rtn ){
											jQuery("body").append( rtn );
											_tool.callback( url );
											_state = "ready";
										});
									} catch( e ) {
										x();
									};
								};
							} , _t );
						};
					x();
				},
				load : function( url ){
					if( !url ){
						return false;
					} else if( !url.replace( _reg.page , "" ) ){
						_tool.require_page( url ); 
					} else if( !url.replace( _reg.js , "" ) ){
						_tool.require_js( url );
					} else if( !url.replace( _reg.css , "" ) ){
						_tool.require_css( url );
					} else if( !url.replace( _reg.img , "" ) ){
						_tool.require_img( url );
					} else {
						_tool.require_other( url );
					};
				},
				/*!
				 *	按照数组的顺序 请求对应的文件
				 */
				order : function(){
					var _url;
					_url = args.url[ _config.__order_index ];
					if( !tool.data.check_url_is_exsit( _url ) ){
						require_list.urls.push( _url );
						_tool.load( _url );
					} else {
						_tool.callback();
					};
				},
				init : function(){
					if( args.wait ){
						_cAsync.alert.set();
					};
					return _config.__order ? this.order() : (function(){
						var _url;
						_config.__count = args.url.length;
						if( !_config.__count ){ return _tool.callback(); };
						for(var i = 0 , len = args.url.length; i < len; i++){
							_url = args.url[ i ];
							if( !tool.data.check_url_is_exsit( _url ) ){
								require_list.urls.push( _url );
								_tool.load( _url );
							} else {
								_tool.callback();
							};
						};
					})();
				}
			};
			_tool.init();
			return _manage = {
				log : function(){
					return _cAsync.tool.rtn( _config );
				}
			};
		};
		tool = {
			data : {
				filter_orgin_url : function(){
					$( document ).ready( function(){
						var _urls 	= [],
							_nodes 	= document.head;
						if( !_nodes ){ return false; };
						_nodes = _nodes.childNodes;
						for( var i = _nodes.length; i--; ){
							if( _nodes[ i ].nodeName === "SCRIPT" && _nodes[ i ].src ){
								_urls.push( _nodes[ i ].outerHTML.replace( /.*src\="(.*)".*/i , "$1" ) );
							} else if( _nodes[ i ].nodeName === "LINK" ){
								_urls.push( _nodes[ i ].outerHTML.replace( /.*href\="(.*)".*/i , "$1" ) );
							};
						};
						manage.filter_require_urls( _urls );
					} );
				},
				check_url_is_exsit : function( url ){
					var _exsit = false;
					for(var i = 0 , len = require_list.urls.length; i < len; i++){
						if( url === require_list.urls[ i ] ){
							_exsit = true;
							break;
						};
					};
					return _exsit;
				},
				require : function( args ){
					var _id = "modal_" + ( ++require_list.length );
					require_list[ _id ] = new require( args , _id );
				}
			}
		};
		manage = {
			/*!
			 *	urls = ["../bin/aa.html" , "../bin/bbb.html"];
			 *	遇到以上的url请求时  直接执行callback命令
			 */
			filter_require_urls : function( urls ){
				require_list.urls = require_list.urls.concat( urls );
				return manage;
			},
			/*!
			************************************************************
			异步从后台请求一个 模块
			args = {
				callback 	: function(){},
				wait		: true | false,
				order 		: true | false,
				url			: [ "bin/xxx.html" ] | "bin/xxx.html"
			};
			***********************************************************
			*/
			require : function( args ){
				if( !args || !args.url ){ return manage; };
				if( typeof args.url === "string" ){
					args.url = [ args.url ];
				} else if( !$.isArray( args.url ) ){
					return manage;
				};
				tool.data.require( args );
				return manage;
			}
		};
		tool.data.filter_orgin_url();
		return manage;
	})(),
	noconflict : function( str ){
		window[ str ] = new _cAsync();
	}
});

_cAsync.fn.noconflict( "$c" );
})();