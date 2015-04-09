#grunt-contrib-creplace

> Auto concat & compress & md5 fileName for your static files

#Getting start
```
require nodejs & grunt
you can get more infomation from :
http://nodejs.org/
http://npmjs.org/
https://www.npmjs.org/package/grunt-contrib-creplace
http://www.gruntjs.org/
```

#Sample example

package.json
```js
{
    "devDependencies": {
        "grunt"                     : "~0.4.0",
        "grunt-contrib-creplace"    : "~0.1.0"
    }
}
```

Gruntfile.js
```js
module.exports = function( grunt ){
    grunt.initConfig({
        replace     : {
            files   : {
                src         : "dev/",
                dest        : "build/",
                ignoreUrl   : /.*xxxx\.com[\/|\\](.*)/
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-creplace');

    grunt.registerTask('default', ['replace']);
};
```

then  cmd like this
>grunt 

done.

#options mapping
###type "src"
your static files dir

###type "dest"
output dir 

###type "ignoreUrl"
the url we don't make md5 name for...
you can use it like array
[ /xxx/ , /aaa/ , /fsa/ ] 
