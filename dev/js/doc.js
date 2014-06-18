$c.define( {
	page 		: $g.modules.doc,
	url 		: [ 
		"page/doc.html" , 
		"css/doc.min.css" , 
		"css/lib/highlight.css" ,
		"js/docExample.js" ,
		"js/lib/highlight.pack.js" 
	],
	constructor : function() {
		var tool,
			self = this,
			html,
			manage;

		tool = {
			data : {
				code : function( str ){
					var _split = "==cb==",
						_str = str.replace( /<\/?code>/g , _split ).split( _split );
					for( var i = _str.length; i--; ){
						if( i % 2 ){
							_str[ i ] = "<code>" + _str[ i ].replace( /</g , "&lt;" ).replace( />/g , "&gt;" ).replace( /\n/ , "" ).replace( /\n/g , "</br>" ).replace( /\s/g , "&nbsp;" ) + "</code>";
						};
					};
					return _str.join("");
				},
				getList : function( func ) {
					$g.config.db.get( function(){
						if( func ){ func( $g.config.db.doc.data ); };
					} );
				}
			},
			ui : {
				getList : function() {
					tool.data.getList( function( list ){
						var _lis 	= [];
						list = list.sort( function( a , b ){
							return a.id > b.id ? -1 : 1;
						} );
						for( var i = list.length; i--; ){
							_lis.push( tool.data.code( $c.tool.JIT( list[ i ] , html.article , "" ) ) );
						};
						config.container.html( _lis.join( "" ) );
						$g.nav.overview.docMenu( list );
					} );
				}
			},
			config : function() {
				html 	= {
					container 		: $( "#doc_container_template" ).html(),
					article 		: $( "#doc_content_container_templete" ).html()
				};
				config 	= {
					container 		: self.config.container
				};
				config.container.html( html.container );
				tool.ui.getList();
				hljs.initHighlightingOnLoad();
			}
		};

		manage = {

		};

		tool.config();
		$c.document = { example : self.example };
		return manage;
	}
} );