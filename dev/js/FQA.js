$c.define( {
	page 		: $g.modules.FQA,
	url 		: [ "page/FQA.html" , "css/FQA.min.css" ],
	constructor : function(){
		var self = this,
			tool,
			html,
			config;

		tool = {
			data : {
				/*!
				 *	获取FQA对应的数据
				 *	@func 	回调函数
				 */
				list : function( func ){
					$g.config.FQA.get( function(){
						if( func ){
							func( $g.config.FQA.FQA );
						};
					} );
				}
			},
			ui : {
				list : function(){
					tool.data.list( function( list ){
						E( list );
						var _lis = [],
							_tmp;
						for( var i = list.length; i--; ){
							_tmp 		= list[ i ];
							_tmp.date 	= $c.tool.date( _tmp.create_time );
							_lis.push( $c.tool.JIT( _tmp , html.cell ) );
						};
						config.container.html( _lis.join( "" ) );
					} );
				}
			},
			config : function(){
				html 	= {
					container 	: $( "#FQA_container_template" ).html(),
					cell 		: $( "#FQA_list_cell_template" ).html()
				};
				config 	= {
					container 	: self.__config.container
				};
				config.container.html( html.container );
			}
		};
		tool.config();
		tool.ui.list();
		return {};
	}
} );