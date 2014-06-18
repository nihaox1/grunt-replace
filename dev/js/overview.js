$c.define( {
	page 		: $g.nav.overview,
	url 		: [ "page/overview.html" , "css/overview.min.css" ],
	constructor : function() {
		var self 	= this,
			config,
			html,
			tool;

		tool = {
			data : {
				/*!
				 *	@func 	回调完成后执行
				 */
				list : function( func ){
					var data = [
							{ require : "home" 		, title : "首页" },
							{ require : "doc" 		, title : "文档手册" },
							{ require : "log" 		, title : "日志" },
							// { require : "download" 	, title : "定制下载" },
							{ require : "FQA" 		, title : "FQA" }
						];
					if( func ){
						func( data );
					};
				}
			},
			event : {
				/*!
				 *	@name 	: string 	待切换的tab名称
				 */
				tab : function( name ){
					config.modal.list.find( "li" ).each( function(){
						var _$this = $( this );
						if( _$this.attr( "func" ) == name ){
							_$this.addClass( "active" );
							if( $g.modules[ name ] ){
								$g.modules[ name ].display();
							};
						} else {
							_$this.removeClass( "active" );
						};
					} );
				},
				/*!
				 *	@$modal 	: 待初始化的列表
				 */
				tabInit : function( $modal ){
					$modal.find( "li" ).click( function(){
						tool.event.tab( $( this ).attr( "func" ) );
					} );
					tool.event.tab( "home" );
				}
			},
			ui : {
				docMenu : function( list ){
					E( list );
					var _lis = [ "<ul class='docMenu'>" ];
					for( var i = list.length; i--; ){
						_lis.push( $c.tool.JIT( list[ i ] , html.docMenuCell ) );
					};
					_lis.push( "</ul>" );
					config.modal.docMenu = config.modal.docMenu || config.container.find( "[func='doc']" );
					config.modal.docMenu.append( _lis.join( "" ) );
				},
				list : function(){
					tool.data.list( function( data ){
						var _lis = [];
						for( var i = 0 , len = data.length; i < len; i++ ){
							_lis.push( $c.tool.JIT( data[ i ] , html.cell ) );
						};
						config.modal.list.html( _lis.join( "" ) );
						tool.event.tabInit( config.modal.list );
					} );
				},
				setModal : function(){
					config.modal = {
						list 		: config.container.find( "[func='list']" ),
						docMenu 	: 0
					};
				}
			},
			config : function(){
				config = {
					container 	: self.config.container,
					modal 		: {}
				};
				html = {
					container 	: $( "#overview_container_template" ).html(),
					cell 		: $( "#overview_list_cell_template" ).html(),
					docMenuCell : $( "#overview_doc_menu_list_cell_template" ).html()
				};
				config.container.html( html.container );
				tool.ui.setModal();
			}
		};

		tool.config();
		tool.ui.list();
		return {
			/*!
			 *	@name 		: 待切换的tab名
			 */
			tab 	: function( name ){
				tool.event.tab( name );
				return this;
			},
			docMenu	: function( list ){
				if( !( list instanceof Array ) ){ return false; };
				tool.ui.docMenu( list );
			}
		};
	}
} );