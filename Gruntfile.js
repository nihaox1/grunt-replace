module.exports = function( grunt ){
	grunt.initConfig( {
		replace 	: {
			one 	: {
				files 	: {
					"pub/" 	: "dev/"
				}
			}
		}
	} );

	grunt.loadNpmTasks( "grunt-replace" );

	grunt.registerTask( "default" , [ "replace" ] );
};