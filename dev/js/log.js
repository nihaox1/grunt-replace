$c.define( {
	page 		: $g.modules.log,
	url 		: [ "css/log.min.css" , "page/log.html" ],
	constructor	: function(){
		var tool,
			self = this,
			manage,
			config,
			html;

		tool = {
			data : {
				/*!
				 *	获取列表的数据
				 *	@func  回调函数  @rtn 	: array
				 */
				list 	: function( func ){
					$g.config.log.get( function(){
						if( func ){ func( $g.config.log.log ); };
					} );
				}
			},
			ui : {
				list 	: function(){
					tool.data.list( function( list ){
						var _lis = [],
							_tmp;
						list.sort( function( a , b ){
							return a.id > b.id ? 1 : -1;
						} );
						for( var i = list.length; i--; ){
							_tmp 		= list[ i ];
							_tmp.date 	= $c.tool.date( _tmp.create_time ); 
							_lis.push( $c.tool.JIT( _tmp , html.listCell , "" ) );
						};
						config.container.html( _lis.join( "" ) );
					} );
					
				},
				setModal : function(){
					config.modal = {

					};
				}
			},
			config : function(){
				html = {
					container 	: $( "#log_container_template" ).html(),
					listCell 	: $( "#log_list_cell_template" ).html()
				};
				config = {
					container 	: self.__config.container
				};
				config.container.html( html.container );
				tool.ui.setModal();
			}
		};

		manage = {

		};
		tool.config();
		tool.ui.list();
		return manage;
	}
} );