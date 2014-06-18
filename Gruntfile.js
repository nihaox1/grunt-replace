module.exports = function( grunt ){
	grunt.initConfig( {
		replace 	: {
			one 	: {
				files 	: {
					src 	: "dev/*.html",
					dest 	: "pub/"
				}
			},
			two 	: {
				files 	: {
					src 	: "dev/*.html",
					dest 	: "tmp/"
				}
			}
		}
	} );

	grunt.loadNpmTasks( "grunt-replace" );

	grunt.registerTask( "default" , [ "replace" ] );
};