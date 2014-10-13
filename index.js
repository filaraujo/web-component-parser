var fs = require('vinyl-fs'),
    deps = require('./lib/deps');

module.exports = {
    dependencies: function(opts) {
        'use strict';

        opts = opts || {};

        if (!opts.src) {
            throw new Error('No source directory defined');
        }

        if (!opts.dest) {
            throw new Error('No destination directory defined');
        }

        return fs.src(opts.src)
            .pipe(deps( opts ))
            .pipe(fs.dest(opts.dest));
    },
    gulp: deps
};
