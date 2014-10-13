var fs = require('vinyl-fs'),
    deps = require('./lib/deps');

module.exports = {
  dependencies: function( opts ){
    'use strict';

    fs.src( opts.src )
      .pipe( deps() )
      .pipe( fs.dest( opts.dest ) );
  },
  gulp: deps
};
