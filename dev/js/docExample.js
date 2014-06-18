$c.define( {
	parent 		: $g.modules.doc,
	constructor : function() {
		var tool,
			html,
			ui,
			config,
			data,
			manage,
			self = this;

		tool = {
			ui : {
				example_alert : function( callback ){
					$c.modal.require({
						url 		: 	[ "js/lib/list.js" , "css/lib/list.min.css" ],
						callback 	: 	function(){
							$c.alert.set({
								content 	: 	"xxx",
								width 		: 	700,
								initialize 	: 	function( modal , _manage ){
									callback( modal , _manage );
								}
							});
						}
					});
				},
				html : function(){
					html = {
						list 		: 	$("#sample_list_containter_template").html(),
						cell 		: 	$("#sample_list_cell_template").html()
					};
				}
			}
		};
		
		manage = {
			example : {
				lead : function( args ){
					$c.modal.require( {
						url 		: 	[ "js/lib/C_lead.min.js" , "css/lib/C_lead.min.css" ],
						callback 	: 	function(){
							$c.lead.set( args || {
								interview  	: [
									{ 
										modal : $( ".page.document .left.well" ),
										content : "这是导航板块"
									},
									{ 
										modal : $( ".header" ),
										content : "这是面板切换板块"
									},
								],
							} );
						}
					} );
				},
				data : ( function(){
					var _data = [];
					for( var i = 1000; i--; ){
						_data.push( { name : "xxxxx" + i } );
					};
					return _data;
				} )(),
				list_8 : function(){
					this.list_1( {
						event 	: 	function( modal , data , index , _manage ){
							modal.click( function(){
								data.name	=	"xxxxxxxxxxxxxxxxx";
								_manage.update( data );
								return false;
							} );
						}
					} , function( list ){
						window.setTimeout( function(){
							$c.alert.set( "列表的总数目：" + list.data().length );
							list.sort( function( node , _node ){
								return 1;
							} );
						} , 3000 );
					} );
				},
				list_7 : function(){
					this.list_1( {
						event 	: 	function( modal , data , index , _manage ){
							modal.click( function(){
								data.name	=	"xxxxxxxxxxxxxxxxx";
								_manage.update( data );
								return false;
							} );
						}
					} );
				},
				list_6 : function(){
					this.list_1( {
						cell : {
							width : 100,
							height : 145
						}
					} );
				},
				list_5 : function(){
					var _list;
					this.list_1( {
						data : function( args ){
							$c.post.set({
								post 		: 	args,
								url 		: 	"example/data.php",
								callback 	: 	function( rtn ){
									_list.append( rtn );
								}
							});
						}
					} , function( list ){
						_list = list;
					} );
				},
				list_4 : function(){
					this.list_1( {
						page : { 
							show 	: 	true,
							input  	: 	true
						}
					} );
				},
				list_3 : function(){
					this.list_1( {
						page : { 
							show 	: 	true
						}
					} );
				},
				list_2 : function(){
					this.list_1( {
						page : { load_all : true }
					} );
				},
				list_1 : function( add , func ){
					tool.ui.example_alert( function( modal , _manage ){
						var _box,
							_list,
							_t = new Date(),
							_args = {
								data 	: 	manage.example.data,
								cell 	: 	{
									width : "100%",
									height : 50
								},
								render 	: 	function( data , __manage ){
									data.time = $c.tool.date();
									return $c.tool.JIT( data , html.cell );
								},
								event 	: 	function( modal , data , index , cell ){

								}
							};
						modal.html( html.list );
						_box = modal.find("article");
						for( var a in add ){
							_args[ a ] = add[ a ];
						};
						_list = _box.C_list( _args );
						if( func ){ func( _list ); };
						$c.alert.set( ( new Date() - _t ) + "ms" );
					} );
				},
				clear : function(){
					$c.alert.set( { 
						content : "xxxx",
						theme 	: "primary",
						top 	: "10%",
						width 	: "30%"
					} );
					$c.alert.set( { 
						content : "cccc",
						theme 	: "info",
						top 	: "15%",
						width 	: "35%"
					} );
					$c.alert.set( { 
						content : "<p><a class='btn btn-danger' onclick='$c.alert.clear();'>清除</a></p>",
						theme 	: "success",
						top 	: "25%",
						width 	: "45%"
					} );
				},
				alert_containter : function(){
					$c.alert.set( {
						content 	: "<div style='height:375px;'></div>",
						theme 		: "success",
						width 		: "80%",
						initialize 	: function( modal , _manage ){
							$c.alert.set( {
								containter 	: modal,
								content 	: " ",
								theme 		: "danger"
							} );
						}
					} );
				},
				alert_all : function(){
					$c.alert.set({
						title : "警告",
						content : "<p>这是一个较复杂的实例！</p>",
						top : "25%",
						width : "60%",
						theme : "default",
						keep : true,
						close : function( modal , _manage ){
							$c.alert.set("啊！我被关闭了！" , 50);
						},
						initialize : function( modal , _manage ){
							window.setTimeout( function(){
								modal.html("我膝盖中了一箭！");
							} , 5000 );
						},
						callback : function( modal , _manage ){
							$c.alert.set("我是无法被关闭的！");
							return false;
						}
					});
				},
				alert : function(){
					$c.alert.set({
						theme : "success",
						width : "30%"
					});
				},
				size : function(){
					$c.alert.set( $c.tool.tsize( 135874562 ) );
					$c.tool.config( {
						precise : 2,
						unit 	: { M : "mb " , K : "k" }
					} , "size" );
					window.setTimeout( function(){
						$c.alert.set( $c.tool.tsize( 135874562 ) , 10 , 5000 );
					} , 3000 );
				},
				date : 	function(){
					$c.alert.set( $c.tool.date( 135874562 ) );
					$c.tool.config( { polish : true , time : "_" , date : "~" } , "date" );
					window.setTimeout( function(){
						$c.alert.set( $c.tool.date( 135874562 ) , 10 , 5000 );
					} , 3000 );
				},
				notice : function(){
					$c.alert.set( "我膝盖中了一箭！" );
				}
			}
		};
		tool.ui.html();
		return manage;
	}
} );