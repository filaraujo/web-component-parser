var fs = require('fs');
var should = require('should');
var through = require('through2');
var wcp = require('../');

var noop = function() {};
var fixtures = ['./test/fixtures/*.html', '!./test/fixtures/*-test.html'];

describe('wcp', function() {
  describe('#dependencies', function() {

    it('should throw an error if no src is defined', function() {
      (wcp.dependencies).should.throw ('No source directory defined');
    });

    it('should throw an error if no dest is defined', function() {
      function func() {
        wcp.dependencies({
          src: fixtures
        });
      };
      (func).should.throw ('No destination directory defined');
    });

    it('should create a default dependency file if no fileName is provided', function(done) {
      function assertFileName(file) {
        should(/dependencies\.json$/.test(file.path)).equal(true);
        fs.unlinkSync(file.path);
        done();
      };

      wcp.dependencies({
        src: fixtures,
        dest: './test/'
      }).pipe(through.obj(assertFileName, noop));
    });

    it('should allow for a fileName for the dependency file', function(done) {
      function assertFileName(file) {
        should(/deps\.json$/.test(file.path)).equal(true);
        fs.unlinkSync(file.path);
        done();
      };

      wcp.dependencies({
        src: fixtures,
        fileName: 'deps',
        dest: './test/'
      }).pipe(through.obj(assertFileName, noop));
    });
  });

  describe('dependency file', function() {
    it('should ignore any files without a proper webcomponent file name', function(done) {
      function assertInvalidComponent(file) {
        var contents = file.contents.toString();
        var obj = JSON.parse(contents);

        obj.should.not.have.property('invalid');
        fs.unlinkSync(file.path);
        done();
      };

      wcp.dependencies({
        src: fixtures,
        dest: './test/'
      }).pipe(through.obj(assertInvalidComponent, noop));
    });

    it('should match files with a proper webcomponent file name', function(done) {
      function assertInvalidComponent(file) {
        var contents = file.contents.toString();
        var obj = JSON.parse(contents);

        obj.should.have.length(4);
        fs.unlinkSync(file.path);
        done();
      };

      wcp.dependencies({
        src: fixtures,
        dest: './test/'
      }).pipe(through.obj(assertInvalidComponent, noop));
    });

    it('should find nested components references with each file', function(done) {
      function assertInvalidComponent(file) {
        var contents = file.contents.toString();
        var obj = JSON.parse(contents);

        obj.should.containEql({
          name: 'wc-a',
          imports: ['polymer', 'wc-b']
        });
        obj.should.containEql({
          name: 'wc-b',
          imports: ['wc-c', 'wc-d']
        });
        obj.should.containEql({
          name: 'wc-d',
          imports: ['wc-a']
        });
        fs.unlinkSync(file.path);
        done();
      };

      wcp.dependencies({
        src: fixtures,
        dest: './test/'
      }).pipe(through.obj(assertInvalidComponent, noop));
    });
  });
});
