module.exports = function( grunt ){
	grunt.initConfig( {
		orgin 	: {
			one 	: {
				files 	: {
					src 	: "dev/*.html",
					dest 	: "pub/"
				}
			}
		}
	} );

	grunt.loadNpmTasks( "grunt-orgin" );

	grunt.registerTask( "default" , [ "orgin" ] );
};