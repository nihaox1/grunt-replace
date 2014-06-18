/*!
 *****************************
 args = {
 	async 				: 	true,
 	total 				: 	1000,
 	当前一次 返回条目少于 offset规定的长度时   后续拉动滚动条依旧调用data
 	keepAsk 			: 	true,
	replace 			: 	true || false,
	tag 				: 	"ul" || "table",
	每次鼠标滚动  支持的最小时间间隔
	scroll_time 		: 	int,
 	page : {
 		show 			: 	true || false,
 		load_all 		: 	true || false,
 		theme			: 	"primary | info | success | warn | error | inverse",
 		在异步时，是否在请求数据时  允许用户继续点击列表事件
 		此条 仅建议在ie下 使用
 		wait			: 	true || false,
		page_size 		: 	5,
		buttom_btn_nums : 	5,
		current    		: 	0
 	},
	data  : [] || function( {
		start : ,
		offset : 
	} ){},
	cell : {
		width 	: 	100,
		height 	: 	125
	},
	render : function( data , manage ){
		return html;
	},
	event : function( modal , data , index , manage ){}
 }
 *****************************
 */
jQuery.fn.C_list = function( args ){
	var tool,
		manage,
		data,
		config,
		cell,
		ui;

	ui = {
		_this 		: this,
		 self 		: jQuery( this ),
		   ul		: 0,
		 page 		: 0
	};

	data = {
		all 	: {
			length 	: 0
		},
		row 	: [],
		end 	: false
	};

	/*!
	 args = {
		modal : 
		index :
		data  : 
		row   :
	 }
	 */
	cell = function( args ){
		var _config,
			_tool,
			_manage;
		_tool = {
			event : function(){
				if( _config.event ){
					_config.event( _config.modal , _config.data , _config.index , _manage );
				};
			},
			display : function(){
				if( _config.display ){ return false; };
				_config.modal.html( _config.render[ 0 ]( _config.data , _manage ) );
				_config.display = true;
				config.async_page.total++;
				_tool.event();
			},
			check : function(){
				_config = {
					__input_params 	: args,
							 index 	: args.index,
							  data  : args.data,
							   row 	: args.row, 
							 modal 	: args.modal,
							 width  : config.cell.width,
							height	: config.cell.height,
							render  : [ config.render ],
						   display 	: false,
						     event	: args.event || config.event
				};
			},
			set_modal : function(){
				_config.modal.css({
					width 	: _config.width,
					height	: _config.height
				}).attr({
					func 	: "c_cell",
					_index  : _config.index,
					_row 	: _config.row
				});
			},
			init : function(){
				var _args;
				if( args.data.__c__info ){
					_config = args.data.__c__info();
					_config.modal = args.modal;
					_config.display = false;
				} else {
					_tool.check();
				};
				_tool.set_modal();
			}
		};
		_manage = {
			__c__info : function(){
				return _config;
			},
			info : function(){
				return _config;
			},
			update : function( data , data_only ){
				if( !data ){ return false; };
				_config.data = data;
				for(var a in data){
					_config.data[ a ] = data[ a ];
				};
				if( !data_only ){
					_config.display = false;
					_tool.display();
				};
			},
			display : function( remove ){
				_tool.display();
			}
		};
		_tool.init();
		return _manage;
	};

	tool = {
		data : {
			theme : function( type ){
				var _type = { primary : 1 , info : 1 , success : 1 , warn : 1 , error : 1 , inverse : 1 };
				if( !type || typeof type !== "string" || !_type[ type ] ){ type = ""; };
				return type;
			},
			sort : function( func ){
				var _data = [],
					_key,
					_big;
				if( config.sorting ){ return false; };
				config.sorting = true;
				for(var i = 0 , len = data.all.length; i < len; i++){
					_data.push( data.all[ i ].__c__info().data );
				};
				_data = $c.tool.sort( _data , func );
				for(var i = 0 , len = data.all.length; i < len; i++){
					data.all[ i ].update( _data[ i ] );
				};
				config.sorting = false;
			},
			addnew : function( start , append ){
				data.end = false;
				if( config.async && config.page.show ){
					ui.ul.empty();
					data.row = [];
					for( var i = 0 , len = append.length; i < len; i++ ){
						data.all[ start + i ] = append[ i ];
					};
					for( var i = 0 , len = append.length; i < len; i++ ){
						ui.ul.append( tool.ui.get_single_row_modal( i + start ) );
					};
					if( !config.total ){
						config.page.total_page = config.async_page.offset > append.length ? ( ( config.async_page.start + config.async_page.offset ) / ( config.page.page_size * config.row_size ) ) : 9999;
					};
				} else {
					for(var i = 0 , len = append.length; i < len; i++){
						if( data.all[ start + i ] && data.all[ start + i ].update ){
							data.all[ start + i ].update( append[ i ] );
						} else {
							data.all[ start + i ] = append[ i ];
						};
					};
					for(var i = Math.floor( data.all.length / config.row_size ) , len = Math.ceil( ( data.all.length + append.length ) / config.row_size ) + 2; i < len; i++){
						if( ( !data.row[ i ] || data.row[ i ] < config.row_size ) && !data.end ){
							ui.ul.append( tool.ui.get_single_row_modal( i ) );
						};
					};
				};
				for(var i = 0 , len = append.length; i < len; i++){
					if( data.all[ start + i ] && data.all[ start + i ].display ){
						data.all[ start + i ].display();
					};
				};
			},
			data : function( start , offset ){
				var _page = {
					start : tool.data.row() * config.row_size || 0,
					offset : config.row_size * config.page_size || 50,
					total  : config.async_page.total || 0,
					end  : false
				};
				_page.start = start || _page.start;
				_page.offset = offset || _page.offset;
				if( config.async && config.page.show ){
					_page.start = config.page.current * config.page_size * config.row_size;
				};
				config.async_page = _page;
				config.appending = true;
				return _page;
			},
			append : function( append , append_to_last ){
				var _s,
					_i,
					_all_length = data.all.length;
				if( append_to_last ){
					_s = config.async_page.start = data.all.length;
				} else {
					_s = config.async_page.start || 0;
				};
				if( !config.async && !config.page.load_all ){
					for(var i = 0 , len = append.length; i < len; i++){
						data.all[ i + config.total ] = append[ i ];
					};
					config.total += len;
					config.appending = false;
					return tool.data.addnew( _s , append );
				};
				tool.data.addnew( ( config.appending ? _s : ( _s + _all_length ) ) , append );
				if( !config.async ){
					return config.appending = false;
				};
				for(var i = 0 , len = append.length; i < len; i++){
					_i = _s + i;
					if( _i > _all_length && config.page.load_all ){
						break;
					} else {
						if( !data.all[ _i ] ){ continue; };
						config.data[ _i ] = append[ i ];
						if( data.all[ _i ].display ){
							data.all[ _i ].display();
						};
					};
				};	
				if( append.length < config.async_page.offset && config.appending ){
					config.async_page.end = true;
				};
				if( config.page.show ){
					if( config.async_page.end ){

					};
					tool.ui.page();
				};
				if( config.callback ){
					config.callback( append , config );
				};
				config.appending = false;
				if( config.async && config.page.show && !config.page.initialize ){
					config.page.initialize = true;
					ui.ul.height( ui.ul.height() );
				};
				if( config.page.show && config.page.wait ){ ui.ul.removeClass("c_list_loading"); };
			},
			total_rows : function(){
				return Math.ceil( config.total / config.row_size );
			},
			row : function(){
				return Math.floor( ui.self.scrollTop() / config.cell.height ); 
			},
			page_size : function(){
				var _h = ui.self.height() || $c.doc.height,
					_ch = ( config.cell.height - 0 ) ? config.cell.height : config.cell.height.replace( /[p|x]*/g , "" );
				if( typeof( _ch ) === "string" && _ch.indexOf("%") !== -1 ){
					return Math.ceil( 1 / ( _ch.replace( /\%/ , "" ) / 100 ) );
				} else {
					return Math.ceil( _h / _ch );
				};
			},
			row_size : function(){
				var _w = ui.self.width(),
					_cw = ( config.cell.width - 0 ) ? config.cell.width : config.cell.width.replace( /[p|x]*/g , "" );
				if( typeof( _cw ) === "string" && _cw.indexOf("%") !== -1 ){
					return Math.floor( 1 / ( _cw.replace( /\%/ , "" ) / 100 ) );
				} else {
					return Math.floor( _w / _cw ) || 1;
				};
			},
			total : function(){
				var _total;
				if( config.async ){
					return args.total;
				} else {
					_total = args.total || config.data.length;
					for(var i = 0; i < _total; i++){
						data.all[ i ] = config.data[ i ] || {};
					};
					return _total;
				};
			},
			page : function( page ){
				var _page = {
					show 			: 	page.show,
					load_all 		: 	page.load_all || false,
					page_size 		: 	page.page_size || 5,
					buttom_btn_nums : 	!config.total ? 1 : ( page.buttom_btn_nums || 5 ),
					current 		: 	page.current || 0,
					input 			: 	page.input || false,
					wait 			: 	page.wait === undefined ? true : false,
					initialize 		: 	false,
					number 			: 	0
				};
				if( _page.show && !page.page_size ){
					page.page_size = Math.floor( ( ui.self.height() - 50 ) / config.cell.height );
					_page.page_size = page.page_size;
				};
				_page.number = _page.page_size * config.row_size;
				_page.total_page = 		Math.ceil( config.total / ( _page.page_size * config.row_size ) ) 
									||	Math.ceil( config.data.length / ( _page.page_size * config.row_size ) );
				if( _page.show ){ _page.load_all = true; };
				if( config.async && config.total === undefined ){
					_page.total_page = 9999; 
				};
				return _page;
			},
			is_async : function(){
				if( !args.data ){ 
					return false; 
				} else if( jQuery.isArray( args.data ) ){
					return false;
				} else if( typeof( args.data ) === "function" ){
					return true;
				};
				return false;
			},
			/*!
			 *	根据传入的
			 */
			tag : function(){
				var _type = { ul : 1 , table : 1 },
					_tag = {
						ul 		: 	"ul",
						li 		: 	"li",
						cell 	: 	"div"
					};
				if( !args.tag || !_type[ args.tag ] ){ 
					return _tag;
				} else {
					return  args.tag == "ul" ? _tag : {
						ul 		: 	"tbody",
						li 		: 	"tr",
						cell 	: 	"td"
					};
				};
			},
			check : function(){
				args = args || {};
				config = {
					__input_params 	: 	$c.tool.rtn( args ),
					theme 			: 	"",
					cell		   	: 	args.cell || { width : "100%" , height : 20 },
					render 		   	: 	args.render || false,
					event		   	: 	args.event || false,
					data		   	: 	args.data || [],
					keepAsk 		: 	args.keepAsk || false,
					async			: 	tool.data.is_async(),
					replace			: 	args.replace === undefined ? false : args.replace,
					appending 		: 	0,
					async_page		: 	0,
					total			:   0,
					page 			: 	0,
					tag 			: 	tool.data.tag(),
					/*	每一行需要填充的cell	*/
					row_size		: 	0,
					/*	一板页面需要填充的行数	*/
					page_size		:   0,
					sorting 		: 	0,
					scroll_time 	: 	args.scroll_time || 50,
					callback 		: 	args.callback || false
				};
				config.total 		= 	tool.data.total();
				config.row_size 	= 	tool.data.row_size();
				config.page_size 	= 	tool.data.page_size();
				config.page 		= 	tool.data.page( ( args.page || {} ) );
				config.total 		= 	!config.async ? config.data.length : config.total;
				config.theme 		=	tool.data.theme( ( args.page && args.page.theme ) ? args.page.theme : "" );
			}
		},
		event : {
			page : function(){
				ui.page.find("a").unbind("click").click( function(){
					var _t = jQuery( this ),
						_func = _t.attr("func"),
						_index,
						_input;
					if( _func === "off" || ( config.page.wait && config.appending ) ){ return false; };
					_index = _t.attr("_index");
					switch( _index ){
						case "first":
							config.page.current = 0;
							break;
						case "pre":
							config.page.current = --config.page.current < 0 ? 0 : config.page.current;
							break;
						case "next":
							config.page.current = ++config.page.current > config.page.total_page ? config.page.total_page : config.page.current;
							break;
						case "last":
							config.page.current = config.page.total_page - 1;
							break;
						case "goto":
							_input = ui.page.find("[func='goto_input']").val();
							if( !jQuery.isNumeric( _input ) || _input <= 0 ){
								return $c.alert.set("请输入数字！");
							} else if( config.page.total_page && _input > config.page.total_page ){
								return $c.alert.set("输入页码超出最大页数！");
							};
							_input--;
							config.page.current = _input >= config.page.total_page ? config.page.total_page : _input;
							ui.page.find("[func='goto_input']").attr( "placeholder" , ( config.page.current + 1 ) ).val("");
							break;
						default :
							config.page.current = _index;
							break;
					};
					config.page.current = parseInt( config.page.current );
					if( !config.async ){ tool.ui.draw_row( true ); };
					if( !config.async || !config.page.show ){
						tool.ui.display();
						tool.ui.page();
					} else {
						if( config.page.wait ){ ui.ul.addClass("c_list_loading") };
						config.data( tool.data.data() );
					};
				} );
			},
			scroll : function(){
				var	_e,
					_x = function(){
						_e = window.setTimeout( function(){
							if( !config.async ){
								tool.ui.display();
							} else {
								if( config.async_page.end && !config.keepAsk ){ return false; };
								config.data( tool.data.data() );
							};
							if( ui.ul.height() - ui.self.scrollTop() <= ui.self.height() && !data.end ){
								tool.ui.append_rows();
							};
						} , config.scroll_time );
					};
				if( config.page.show ){ return false; };
				ui.self.scroll(function(){
					window.clearTimeout( _e );
					_x();
				});
				tool.ui.show_scroll();
			},
			init : function(){
				tool.event.scroll();
			}
		},
		ui : {
			get_single_row_modal : function( row ){
				var _i,
					_modal,
					_li,
					_append;
				if( data.row[ row ] != undefined && !config.page.show ){
					_append = true;
					_li = ui.ul.find("[func='c_row'][_row='" + row + "']");
				} else {
					_li = jQuery("<" + config.tag.li + " class='c_row' _row='" + row + "' func='c_row' style='height:" + config.cell.height + "px'></" + config.tag.li + ">");
				};
				for(var k = 0; k < config.row_size; k++){
					_i = row * config.row_size + k;
					if( data.row[ row ] > k && _append ){ continue; };
					if( !data.all[ _i ] && !config.async ){
						data.end = true;
						break;
					};
					if( config.async && config.page.load_all && _i >= config.total ){ data.end = true; break; };
					if( config.async && ( !data.all[ _i ] || data.all[ _i ] instanceof cell ) ){ data.end = true; break; };
					if( config.cell.width === "100%" || config.cell.width == ui.self.width() ){
						_modal = _li;
					} else {
						_modal = jQuery("<" + config.tag.cell + " class='c_cell'>");
						_li.append( _modal );
					};
					data.all[ _i ] = new cell({
						modal : _modal,
						index : _i,
						row   : row,
						data  : data.all[ _i ]
					});
					data.all.length++;
				};
				data.row[ row ] = k;
				return _append ? "" : _li;
			},
			append_rows : function(){
				if( config.async && config.page.load_all ){ return false; };
				var _start = config.page.current * config.page.page_size;
				if( _start > config.data.length ){ return false; };
				for(var i = 0 , len = config.page.page_size + 2; i < len; i++){
					if( !data.row[ _start + i ] && !data.end ){
						if( config.total && ( _start + i ) * config.row_size >= config.total ){ break; };
						ui.ul.append( tool.ui.get_single_row_modal( _start + i ) );
					};
				};
				config.page.current++;
				if( data.row.length < config.page_size ){
					tool.ui.append_rows();
				};
			},
			draw_row : function( all ){
				var _rows,
					_modal,
					_i;
				if( !all ){
					return tool.ui.append_rows();
				};
				if( config.page.show ){
					_i = config.page.current * config.page.page_size;
					for(var i = 0; i < config.page.page_size; i++){
						ui.ul[ ( !i ? "html" : "append" ) ]( tool.ui.get_single_row_modal( _i + i ) );
					};
				} else {
					_rows = tool.data.total_rows()
					for(var i = 0; i < _rows; i++){
						ui.ul.append( tool.ui.get_single_row_modal( i ) );
					};
				};
			},
			display : function(){
				var _start;
				if( !config.page.show ){
					_start = ( tool.data.row() - 1 ) * config.row_size;
					_start = _start < 0 ? 0 : _start;
					for(var i = 0 , len = config.row_size * ( config.page_size + 1 ); i < len; i++){
						if( data.all[ _start + i ] && data.all[ _start + i ].display ){
							data.all[ _start + i ].display();
						};
					};
				} else {
					_start = config.page.current * config.page.page_size * config.row_size;
					for(var i = 0 , len = config.page.page_size * config.row_size; i < len; i++){
						if( data.all[ _start + i ] && !config.async ){
							data.all[ _start + i ].display();
						};
					};
				};
			},
			/*!
			 * 	修复
			 *	page.load_all = false; 时  在某些情况下没有出现滚动条时 会出现的bug
			 */
			show_scroll : function(){
				if( config.page.load_all == true ){ return false; };
				while( ui.ul.height() < ui.self.height() && data.all.length && config.async_page.end ){
					tool.ui.append_rows();
				};
			},
			page : function(){
				if( !config.page.show ){ return false; };
				var _c = config.page.current,
					_span = ui.page.find("span[func='c_page']"),
					_total = config.page.total_page - 1,
					_x = function(){
						var _c = config.page.current,
							_btns = ["<a class='btn active' _index='" + _c + "' func='off'>" + ( _c + 1 ) + "</a>"],
							_i = 1,
							_go;
						while( _btns.length < config.page.buttom_btn_nums ){
							_go = false;
							if( _c - _i >= 0 ){
								_btns = ["<a class='btn' _index='" + ( _c -_i ) + "'>" + ( _c - _i + 1 ) + "</a>"].concat( _btns );
								_go = true;
							};
							if( _btns.length == config.page.buttom_btn_nums ){ break; };
							if( _c + _i < config.page.total_page ){
								_btns.push("<a class='btn' _index='" + ( _c +_i ) + "'>" + ( _c + _i + 1 ) + "</a>");
								_go = true;
							};
							if( !_go ){ break; };
							_i++;
						};
						ui.page.find("[func='c_page']").html( _btns.join("") );
						tool.event.page();
					};
				if( _c == 0 ){
					ui.page.find("a").each( function(){
						var _t = jQuery( this ),
							_i = _t.attr("_index");
						if( ( config.total <= config.page.page_size ) || _i == "first" || _i == "pre" ){
							_t.addClass("disabled").attr( "func" , "off" );
						} else {
							_t.removeClass("disabled").removeAttr("func");
						};
					} );
				} else if( _c == _total ){
					ui.page.find("a").each( function(){
						var _t = jQuery( this ),
							_i = _t.attr("_index");
						if( _i == "next" || _i == "last" ){
							_t.addClass("disabled").attr( "func" , "off" );
						} else {
							_t.removeClass("disabled").removeAttr("func");
						};
					} );
				} else {
					ui.page.find("a").each( function(){
						var _t = jQuery( this ),
							_i = _t.attr("_index");
						if( _i == config.page.current ){
							_t.addClass("disabled").attr( "func" , "off" );
						} else {
							_t.removeClass("disabled").removeAttr("func");
						};
					} );
				};
				_x();
			},
			/*!
			 *	处理在tag标签为 table的情况下  拼接page项
			 *	@len 	按钮的长度
			 */
			set_table_page : function( len ){
				var _lis 	= [],
					_first 	= ( config.async && !config.total ) ? "" : "<td><a class='btn' _index='first'>首页</a></td>",
					_last 	= ( config.async && !config.total ) ? "" : "<td><a class='btn' _index='last'>尾页</a></td>";
				if( config.page.input ){
					_last += "<td><input type='text' class='c_list_input' func='goto_input' />" + ( !config.total ? "" : " / " + config.page.total_page ) + "<a class='btn' _index='goto'>跳转</a></td>";
				};
				_lis.push( "\
							<tfoot class='c_list_page' func='c_list_page'>\
								" + _first + "\
								<td><a class='btn' _index='pre'>上一页</a></td>\
								<td func='c_page'>\
									<a class='btn' _index='0'>1</a>\
					" );
				for( var i = 1; i < len; i++ ){
					_lis.push("<a class='btn' _index='" + i + "'>" + ( i + 1 ) + "</a>");
				};
				_lis.push( "\
								</td>\
								<td><a class='btn' _index='next'>下一页</a></td>\
								" + _last + "\
							</tfoot>\
					" );
				return _lis;
			},
			set_page : function(){
				var _lis = [],
					_h,
					len,
					_first,
					_last;
				if( !config.page.show ){ return false; };
				
				config.page_size = config.page.page_size;
				len = config.page.buttom_btn_nums > config.page.total_page  ? config.page.total_page : config.page.buttom_btn_nums;
				if( config.tag.ul == "tbody" ){
					_lis = tool.ui.set_table_page( len );
				} else {
					_first 	= ( config.async && !config.total ) ? "" : "<a class='btn' _index='first'>首页</a>",
					_last 	= ( config.async && !config.total ) ? "" : "<a class='btn' _index='last'>尾页</a>";
					if( config.page.input ){
						_last += "<input type='text' class='c_list_input' func='goto_input' />" + ( !config.total ? "" : " / " + config.page.total_page ) + "<a class='btn' _index='goto'>跳转</a>";
					};
					_lis.push("\
							<div class='c_list_page' func='c_list_page'>\
								" + _first + "\
								<a class='btn' _index='pre'>上一页</a>\
								<span func='c_page'>\
									<a class='btn' _index='0'>1</a>\
						 ");
					for(var i = 1; i < len; i++){
						_lis.push("<a class='btn' _index='" + i + "'>" + ( i + 1 ) + "</a>");
					};
					_lis.push("\
								</span>\
								<a class='btn' _index='next'>下一页</a>\
								" + _last + "\
							</div>");
				};
				ui.self.find("[func='c_list_page']").remove();
				ui.page = jQuery( _lis.join("") );
				ui.page.addClass( config.theme );
				ui.self.append( ui.page );
				if( !config.page.show ){
					tool.event.page();
				};
			}
		},
		init : function(){
			tool.data.check();
			if( config.replace ){
				ui.ul = ui.self;
				ui.ul.addClass("c_list").attr( "func" , "c_ul" );
			} else {
				ui.ul = jQuery("<" + config.tag.ul + " class='c_list' func='c_ul'>");
				ui.self[ config.tag.ul == "ul" ? "html" : (function(){
					ui.self.find( "tbody , tfoot" ).remove();
					return "append";
				})() ]( ui.ul );
			};
			if( config.page.show ){ 
				tool.ui.set_page();
				tool.ui.page();
			};
			ui.self.css( "overflow-y" , "auto" );
			tool.ui.draw_row( config.page.load_all );
			if( config.async ){
				window.setTimeout( function(){
					config.data( tool.data.data() );
				} , 10 );
			} else {
				tool.ui.display();
			};
			tool.event.init();
		}
	};
	manage = {
		/*!
		 str = "last" | "first" | int | undefined
		 */
		node : function( str ){
			str = str || "last";
			if( str === "first" ){
				return data.all["0"];
			} else if( str === "last" ){
				return data.all[ data.all.length - 1 ];
			} else if( typeof( str ) === "number" ){
				return data.all[ str - 1 ] || data.all[ data.all.length - 1 ];
			};
		},
		data : function( start , offset ){
			if( !arguments.length ){
				return data.all;
			};
			if( config.async ){
				config.data( tool.data.data( start , offset ) );
			};
		},
		/*!
		 *	重置列表的总条目信息
		 */
		total : function( number ){
			var _current;
			number = parseInt( number );
			if( number === undefined || typeof number !== "number" ){ return false; };
			config.total = number;
			if( config.page.show ){
				_current = config.page.current;
				config.page 		= 	tool.data.page( ( args.page || {} ) );
				config.page.current = _current;
				tool.ui.set_page();
				tool.ui.page();
			};
		},
		/*!
		func( a , b ){ return true | false; };
		 */
		sort : function( func ){
			if( !args || typeof func !== "function" ){ return false; };
			tool.data.sort( func );
		},
		refresh : function(){
			if( config.page.show ){ 
				tool.ui.set_page();
				tool.ui.page();
			};
			tool.ui.draw_row( config.page.load_all );
			if( config.async ){
				window.setTimeout( function(){
					config.data( tool.data.data() );
				} , 10 );
			} else {
				tool.ui.display();
			};
			tool.event.init();
		},
		/*!
		 *	data = array()
		 *	append_to_last ： 是否
		 */
		append : function( data , append_to_last ){
			if( !data || !jQuery.isArray( data ) ){ return false; };
			tool.data.append( data , ( ( append_to_last !== undefined ) ? append_to_last : ( !config.async ? true : false ) ) );
		}
	};
	tool.init();
	return manage;
};