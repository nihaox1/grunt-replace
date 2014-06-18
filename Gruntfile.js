module.exports = function( grunt ){
	grunt.initConfig( {
		replace 	: {
			one 	: {
				files 	: {
					src 	: "dev/",
					dest 	: "pub/"
				}
			}
		}
	} );

	grunt.loadNpmTasks( "grunt-replace" );

	grunt.registerTask( "default" , [ "replace" ] );
};