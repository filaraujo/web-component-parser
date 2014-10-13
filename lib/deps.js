var path = require('path');
var htmlparser = require('htmlparser2');
var through = require('through2');
var File = require('vinyl');


module.exports = function() {
    'use strict';

    var dependencies = {},
        firstFile;

    function method(file, enc, callback) {
        console.log(file);

        var fileName = path.basename(file.path, '.html'),
            // should follow the dash web component spec
            isComponent = /[a-z]+\-[a-z]+/.test(fileName);

        if (!firstFile) {
            firstFile = file;
        }

        if (isComponent) {
            dependencies[fileName] = {
                name: fileName,
                imports: [],
            };

            var parser = new htmlparser.Parser({
                onopentag: function(name, attribs) {
                    if (name === "link" && attribs.rel === 'import') {
                        dependencies[fileName].imports.push(path.basename(attribs.href, '.html'));
                    }
                }
            });

            parser.write(file.contents.toString());
            parser.end();
        }

        callback();
    }


    function endStream(cb) {
        this.push(new File({
            cwd: firstFile.cwd,
            base: firstFile.cwd,
            path: path.join(firstFile.cwd, 'dependencies.json'),
            contents: new Buffer(JSON.stringify(dependencies, null, 4))
        }));
        return cb();
    };

    return through.obj(method, endStream);
};
