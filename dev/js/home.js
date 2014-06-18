$c.define( {
	page 		: $g.modules.home,
	url 		: [ "page/home.html" , "css/home.min.css" ],
	constructor : function() {
		var self = this,
			config,
			html,
			tool;

		tool = {
			config : function(){
				config = {
					container 	: self.config.container
				};
				html = {
					container 	: $( "#home_container_template" ).html()
				};
				config.container.html( html.container );
			}
		};

		tool.config();

		return {
			
		};
	}
} );