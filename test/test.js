var fs = require('fs');
var should = require('should');
var through = require('through2');

var wcp = require('../');

var noop = function() {};


describe('wcp', function() {
    describe('#dependencies', function() {

        it('should throw an error if no src is defined', function() {
            (wcp.dependencies).should.
            throw ('No source directory defined');
        });

        it('should throw an error if no dest is defined', function() {
            var func = function() {
                wcp.dependencies({
                    src: './test/fixtures/*.html'
                });
            };
            (func).should.
            throw ('No destination directory defined');
        });

        it('should create a default dependency file if no fileName is provided', function(done) {
            var assertFileName = function(file) {
                should(/dependencies\.json$/.test(file.path)).equal(true);
                fs.unlinkSync(file.path);
                done();
            };

            wcp.dependencies({
                src: './test/fixtures/*.html',
                dest: './test/'
            }).pipe(through.obj(assertFileName, noop));
        });

        it('should allow for a fileName for the dependency file', function(done) {
            var assertFileName = function(file) {
                should(/deps\.json$/.test(file.path)).equal(true);
                fs.unlinkSync(file.path);
                done();
            };

            wcp.dependencies({
                src: './test/fixtures/*.html',
                fileName: 'deps',
                dest: './test/'
            }).pipe(through.obj(assertFileName, noop));
        });
    });

    describe('dependency file', function() {
        it('should ignore any files without a proper webcomponent file name', function(done) {
            var assertInvalidComponent = function(file) {
                var contents = file.contents.toString(),
                    obj = JSON.parse(contents);

                obj.should.not.have.property('invalid');
                fs.unlinkSync(file.path);
                done();
            };

            wcp.dependencies({
                src: './test/fixtures/*.html',
                dest: './test/'
            }).pipe(through.obj(assertInvalidComponent, noop));
        });

        it('should match files with a proper webcomponent file name', function(done) {
            var assertInvalidComponent = function(file) {
                var contents = file.contents.toString(),
                    obj = JSON.parse(contents);

                obj.should.have.property('wc-a');
                obj.should.have.property('wc-b');
                obj.should.have.property('wc-c');
                obj.should.have.property('wc-d');
                fs.unlinkSync(file.path);
                done();
            };

            wcp.dependencies({
                src: './test/fixtures/*.html',
                dest: './test/'
            }).pipe(through.obj(assertInvalidComponent, noop));
        });

        it('should find nested components references with each file', function(done) {
            var assertInvalidComponent = function(file) {
                var contents = file.contents.toString(),
                    obj = JSON.parse(contents);

                obj['wc-a'].should.have.property('imports');
                obj['wc-a'].should.have.property('imports', ['polymer', 'wc-b']);
                obj['wc-b'].should.have.property('imports');
                obj['wc-b'].should.have.property('imports', ['wc-c', 'wc-d']);
                obj['wc-d'].should.have.property('imports');
                obj['wc-d'].should.have.property('imports', ['wc-a']);
                fs.unlinkSync(file.path);
                done();
            };

            wcp.dependencies({
                src: './test/fixtures/*.html',
                dest: './test/'
            }).pipe(through.obj(assertInvalidComponent, noop));
        });
    });
});
