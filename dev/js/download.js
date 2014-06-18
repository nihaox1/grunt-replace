$c.define( {
	page 		: $g.modules.download,
	url 		: [ "page/download.html" , "css/download.min.css" ],
	constructor : function(){
		var self = this,
			tool,
			html,
			config;
		tool = {
			config : function(){
				html 	= {

				}; 
				config 	= {
					container 	: self.__config.container
				};

			}
		};
		tool.config();
		return {};
	}
} );