(function( $ ){
	var $g = window.$g = {
		nav 		: $c.page( $( "article aside[func='nav']" ) , {
			overview 	: "js/overview.js"
		} ),
		modules 	: $c.page( $( "article .container" ) , {
			home 	: "js/home.js",
			doc 	: "js/doc.js",
			log 	: "js/log.js",
			FQA 	: "js/FQA.js",
			download: "js/download.js"
		} ),
		config 		: $c.page( {
			db 		: "core/dbStr.js",
			log 	: "core/logStr.js",
			FQA  	: "core/FQAStr.js"
		} )
	};
	$( "article" ).height( $( document ).height() - 45 );
	$g.nav.overview.display();
})( jQuery );