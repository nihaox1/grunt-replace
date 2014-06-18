module.exports = function( grunt ){
	grunt.initConfig( {
		replace 	: {
			one 	: {
				files 	: {
					src_dir 	: "dev/",
					pub_dir 	: "pub/"
				}
			}
		}
	} );

	grunt.loadNpmTasks( "grunt-replace" );

	grunt.registerTask( "default" , [ "replace" ] );
};