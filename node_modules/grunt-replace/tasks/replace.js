var sys,
	tool,
	grunt,
	config,
	minjs 	= require( "uglify-js" ),
	mincss 	= require( "clean-css" ),
	/*! 要处理的HTML原型	*/
	Html,
	E;

E = function( x ){
	grunt.log.writeln( x );
};

Html = function( url ){
	var _self = this,
		_tool,
		_config;

	_tool = {
		config : function(){
			var _tp = new Date().getTime();
			_config = {
				__url 		: url,
				url 		: url,
				dest 		: config.dir.pub_dir + url.replace( /[\d|\w]*[\\|\/](.*)/gi , "$1" ),
				html 		: 0,
				js 			: 0,
				css 		: 0,
				tp 			: _tp,
				name 		: url.replace( /.*[\/|\\](.*)$/g , "$1" ),
				md5  		: tool.md5( config.md5 + _tp + parseInt( Math.random() * 999999999 ) )
			};
			_self.config = _config;
		}
	};
	_tool.config();
	Html.fn.lists.push( _self );
	this.handle();
};

Html.fn = Html.prototype;

Html.fn.lists = [];

Html.fn.handle = function(){
	var _content 	= grunt.file.read( this.config.url ).toString().
						replace( /\s+/gi , " " ).
							replace( />\s+</gi , "><" );
	this.config.html = _content;
	this.config.html = tool.replace_css.call( this );
	this.config.html = tool.replace_js.call( this );
	grunt.file.write( this.config.dest , this.config.html );
};

tool = {
	config : function(){
		config = {
			md5 		: "AYNKJKLHF",
			dir 		: {},
			/*!
			 * 	用于记录已处理的文件路径
			 */
			file_path 	: {
				html 	: {},
				css 	: {},
				js 		: {},
				others 	: []
			},
			/*!
			 *	用户过滤目录中相同的资源文件
			 */
			resources 	: {}
		};
	},
	md5 : function( str ){
		var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
		var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */
		var chrsz   = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */

		/*
		 * These are the functions you'll usually want to call
		 * They take string arguments and return either hex or base-64 encoded strings
		 */
		function hex_md5(s){ return binl2hex(core_md5(str2binl(s), s.length * chrsz));};

		/*
		 * Calculate the MD5 of an array of little-endian words, and a bit length
		 */
		function core_md5(x, len){
		  /* append padding */
		  x[len >> 5] |= 0x80 << ((len) % 32);
		  x[(((len + 64) >>> 9) << 4) + 14] = len;

		  var a =  1732584193;
		  var b = -271733879;
		  var c = -1732584194;
		  var d =  271733878;

		  for(var i = 0; i < x.length; i += 16)
		  {
		    var olda = a;
		    var oldb = b;
		    var oldc = c;
		    var oldd = d;

		    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
		    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
		    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
		    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
		    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
		    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
		    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
		    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
		    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
		    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
		    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
		    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
		    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
		    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
		    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
		    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

		    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
		    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
		    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
		    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
		    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
		    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
		    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
		    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
		    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
		    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
		    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
		    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
		    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
		    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
		    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
		    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

		    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
		    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
		    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
		    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
		    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
		    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
		    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
		    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
		    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
		    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
		    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
		    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
		    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
		    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
		    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
		    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

		    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
		    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
		    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
		    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
		    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
		    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
		    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
		    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
		    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
		    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
		    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
		    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
		    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
		    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
		    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
		    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

		    a = safe_add(a, olda);
		    b = safe_add(b, oldb);
		    c = safe_add(c, oldc);
		    d = safe_add(d, oldd);
		  }
		  return Array(a, b, c, d);
		}

		/*
		 * These functions implement the four basic operations the algorithm uses.
		 */
		function md5_cmn(q, a, b, x, s, t)
		{
		  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
		}
		function md5_ff(a, b, c, d, x, s, t)
		{
		  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
		}
		function md5_gg(a, b, c, d, x, s, t)
		{
		  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
		}
		function md5_hh(a, b, c, d, x, s, t)
		{
		  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
		}
		function md5_ii(a, b, c, d, x, s, t)
		{
		  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
		}

		/*
		 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
		 * to work around bugs in some JS interpreters.
		 */
		function safe_add(x, y)
		{
		  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
		  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		  return (msw << 16) | (lsw & 0xFFFF);
		}

		/*
		 * Bitwise rotate a 32-bit number to the left.
		 */
		function bit_rol(num, cnt)
		{
		  return (num << cnt) | (num >>> (32 - cnt));
		}

		/*
		 * Convert a string to an array of little-endian words
		 * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
		 */
		function str2binl(str)
		{
		  var bin = Array();
		  var mask = (1 << chrsz) - 1;
		  for(var i = 0; i < str.length * chrsz; i += chrsz)
		    bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
		  return bin;
		}

		/*
		 * Convert an array of little-endian words to a string
		 */
		function binl2str(bin)
		{
		  var str = "";
		  var mask = (1 << chrsz) - 1;
		  for(var i = 0; i < bin.length * 32; i += chrsz)
		    str += String.fromCharCode((bin[i>>5] >>> (i % 32)) & mask);
		  return str;
		}

		/*
		 * Convert an array of little-endian words to a hex string.
		 */
		function binl2hex(binarray)
		{
		  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
		  var str = "";
		  for(var i = 0; i < binarray.length * 4; i++)
		  {
		    str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
		           hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
		  }
		  return str;
		}

		/*
		 * Convert an array of little-endian words to a base-64 string
		 */
		function binl2b64(binarray)
		{
		  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		  var str = "";
		  for(var i = 0; i < binarray.length * 4; i += 3)
		  {
		    var triplet = (((binarray[i   >> 2] >> 8 * ( i   %4)) & 0xFF) << 16)
		                | (((binarray[i+1 >> 2] >> 8 * ((i+1)%4)) & 0xFF) << 8 )
		                |  ((binarray[i+2 >> 2] >> 8 * ((i+2)%4)) & 0xFF);
		    for(var j = 0; j < 4; j++)
		    {
		      if(i * 8 + j * 6 > binarray.length * 32) str += b64pad;
		      else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
		    }
		  }
		  return str;
		};

		return hex_md5( str );
	},
	get_pub_file_path : function( dev_file_path ){
		return dev_file_path.replace( /[\w|\d]*[\/|\\](.*)/gi , config.dir.pub_dir + "$1" );
	},
	copy_other_files : function(){
		var _url = function( url ){
				return config.dir.pub_dir + url.replace( /^[^\\|\/]*[\/|\\]/gi , "" )
			};
		for( var a in config.file_path.js ){
			grunt.file.write( _url( a ) , minjs.minify( a ).code.toString() );
		};
		for( var a in config.file_path.css ){
			grunt.file.write( _url( a ) , new mincss( {} ).minify( grunt.file.read( a ) ) );
		};
		for( var a in config.resources ){
			grunt.file.copy( a , config.dir.pub_dir + config.resources[ a ] );
		};
		for( var i = config.file_path.others.length; i--; ){
			grunt.file.copy( config.file_path.others[ i ] , _url( config.file_path.others[ i ] ) );
		};
	},
	del_file_from_hash : function( url ){
		if( config.file_path.js[ url ] ){
			delete config.file_path.js[ url ];
		} else if( config.file_path.css[ url ] ) {
			delete config.file_path.css[ url ];
		};
	},
	/*!
	 *	根据文件的相对地址 获取 它的目录
	 *	@url 	{string} 	相对地址
	 *	@belong {string} 	归属文件的相对地址
	 */
	get_resource_path : function( url , belong ){
		return ( belong.replace( /(.*[\/|\\]).*/gi , "$1" ) + url.replace( /\?|\#.*/gi , "" ) ).
					replace( /[\\|\/][^\\|^\/]*[\\|\/]\.{2}/gi , "" );
	},
	/*!
	 *	修正对应内容的图片/其它资源的引用
	 *	@str 	{string} 	内容
	 *	@dest 	{string} 	目标文件地址
	 * 	return 	修正后的内容
	 */
	fix_image_url : function( str , dest ){
		var _spilt 	= "cb==cb",
			_imgs 	= str.replace( /\s+/gi , " " ).replace( /url\(([^\)]*)\)/gi , _spilt + "$1" + _spilt ).split( _spilt ),
			_md5,
			_dest;
		for( var i = _imgs.length; i--; ){
			if( i % 2 ){
				_img 	= tool.get_resource_path( _imgs[ i ].replace( /\'|\"*/gi , "" ) , dest );
				if( !config.resources[ _img ] ){
					_md5 	= [
						"resources/",
						tool.md5( config.md5 + new Date().getTime() + parseInt( Math.random() * 999999999 ) ),
						_img.replace( /.*(\..*)$/gi , "$1" )
					];
					_md5 = _md5.join( "" )  
					config.resources[ _img ] = _md5;
				} else {
					_md5 = config.resources[ _img ];
				};
				_imgs[ i ] = "url('../" + _md5 + "')";
			};
		};
		return _imgs.join( "" );
	},
	/*!
	 *	压缩文件
	 *	@replace 	{object} 	replace 的配置文
	 *	@dest 		{string} 	保存的目标地址
	 *	return  	{string}
	 */
	uglify_css : function( replace , dest ){
		var _buffer = [],
			_url,
			_code,
			_files  = replace.css;
		for( var i = _files.length; i--; ){
			_url 	= config.dir.src_dir + _files[ i ];
			if( grunt.file.exists( _url ) ){
				_code = tool.fix_image_url( grunt.file.read( _url ).toString() , _url );
				_buffer.push( _code );
			};
		};
		_code = new mincss( {} ).minify( _buffer.join( "" ) );
		grunt.file.write( dest , _code );
	},
	/*!
	 *	压缩文件
	 *	@replace 	{object} 	replace 的配置文
	 *	@dest 		{string} 	保存的目标地址
	 *	return  	{string}
	 */
	uglify_js : function( replace , dest ){
		var _urls = [];
		for( var i = replace.js.length; i--; ){
			_urls.push( config.dir.src_dir + replace.js[ i ] );
		};
		grunt.file.write( dest , minjs.minify( _urls ).code.toString() );
	},
	/*!
	 *	串联文件
	 *	@files 		{array}		待串联的文件集合
	 *	@replace 	{object} 	replace 的配置文件
	 */
	concat_done 	: function( files , replace , dest ){
		var	_url;
		for( var i = files.length; i--; ){
			_url 	= replace.src + files[ i ];
			tool.del_file_from_hash( _url );
		};
	},
	/*!
	 *	串联文件
	 *	@files 		{array}		待串联的文件集合
	 *	@replace 	{object} 	replace 的配置文件
	 */
	concat 	: function( files , replace , dest ){
		var _buffer = [],
			_url;
		for( var i = files.length; i--; ){
			_url 	= replace.src + files[ i ];
			tool.del_file_from_hash( _url );
			if( grunt.file.exists( _url ) ){
				_buffer.push( grunt.file.read( _url ).toString() );
			};
		};
		grunt.file.write( dest , _buffer.join( "" ) );
	},
	/*!
	 *	替换html文本中的 JS项
	 */
	replace_js : function(){
		var _replace	= this.config.tp + "$1" + this.config.tp;
			_al 		= this.config.html.replace( /(<script[^\\>]*src=[^\\>]*><\/script>)/gi , _replace ).split( this.config.tp ),
			_js 		= [],
			_url 		= "js/" + this.config.md5 + ".js";
		for( var i = _al.length; i--; ){
			if( i % 2 ){
				_js.push( _al[ i ].replace( /.*src=['|"](.*)['|"].*/gi , "$1" ) );
				_al[ i ] = i == 1 ? "<script type='text/javascript' src='" + _url + "'></script>" : "";
			};
		};
		if( _js.length ){
			this.config.js = _js;
			tool.uglify_js( this.config , config.dir.pub_dir + _url );
			tool.concat_done( _js , this.config , config.dir.pub_dir + _url );
		};
		return _al.join( "" );
	},
	replace_css: function(){
		var _replace	= this.config.tp + "$1" + this.config.tp;
			_al 		= this.config.html.replace( /(<link[^>]*>)/gi , _replace ).split( this.config.tp ),
			_css 		= [],
			_url 		= "css/" + this.config.md5 + ".css";
		for( var i = _al.length; i--; ){
			if( i % 2 ){
				_css.push( _al[ i ].replace( /.*href=['|"](.*)['|"].*/gi , "$1" ) );
				_al[ i ] = i == 1 ? "<link rel='stylesheet' type='text/css' href='" + _url + "'>" : "";
			};
		};
		if( _css.length ){
			this.config.css = _css;
			tool.uglify_css( this.config , config.dir.pub_dir + _url );
			tool.concat_done( _css , this.config , config.dir.pub_dir + _url );
		};
		return _al.join( "" );
	},
	get_html_files 	: function( dir ){
		grunt.file.recurse( dir , function( path ){
			if( /.*\.html$/gi.test( path ) ){
				config.file_path.html[ path ] = true;
				new Html( path );
			} else if( /.*\.css$/gi.test( path ) ) {
				config.file_path.css[ path ] = true;
			} else if( /.*\.js$/gi.test( path ) ) {
				config.file_path.js[ path ] = true;
			} else {
				config.file_path.others.push( path );
			};
		} );
	},
	get_handle_dir : function(){
		sys.files.forEach( function( file ){
			config.dir = {
				src_dir 	: file.src.toString(),
				pub_dir 	: file.dest.toString()
			};
			if( !grunt.file.isDir( config.dir.src_dir ) ){
				return false;
			};
			if( grunt.file.isDir( config.dir.pub_dir ) ){
				grunt.file.delete( config.dir.pub_dir , { force : true } );
			};
			grunt.file.mkdir( config.dir.pub_dir );
		} );
	},
	init : function(){
		tool.get_handle_dir();
		if( config.dir.src_dir && config.dir.pub_dir ){ 
			tool.get_html_files( config.dir.src_dir );
			tool.copy_other_files();
		};
		E( "replace completed!!" );
	}
};

module.exports = function( __grunt ){
	grunt = __grunt;
	grunt.registerMultiTask( "replace" , "Test" , function(){
		sys = this;
		tool.config();
		tool.init();
	} );	
};