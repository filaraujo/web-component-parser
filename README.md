# web-component-parser

Parses html for web component references and creates a dependency json

[![Build Status](https://travis-ci.org/filaraujo/web-component-parser.svg?branch=master)](https://travis-ci.org/filaraujo/web-component-parser)


## Install

```node
npm install web-component-parser --save
```

## Usage
```javascript
var wcp = require('wcp');

wcp.dependencies({
    fileName: 'deps',
    src: './test/fixtures/*.html',
    dest: './test/'
};
```

## dependencies([options])
You can call the dependencies api directly, this will return a `vinyl-fs` stream object allowing
it to be piped.

* `options` {Object}
  * `src` {Array|String} source directory for `html` files to parse
  * `dest` {String} destination directory to add json file
  * `fileName` {String} file name of json file that will be created. Defaults to `dependencies`.json

## gulp
`web-component-parser` can be used directly with gulp.

```javascript
var gulp = require('gulp'),
    wcp = require('wcp');

gulp.task( 'deps', function(){
    return gulp.src('./test/fixtures/*.html')
        .pipe( wcp({
            fileName: 'fileName'
        }) )
        .pipe( gulp.dest('./test/') );
});
```

## licence
MIT
