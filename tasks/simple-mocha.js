/* * grunt-simple-mocha
 * https://github.com/yaymukund/grunt-simple-mocha
 *
 * Copyright (c) 2012 Mukund Lakshman
 * Licensed under the MIT license.
 */
"use strict";

module.exports = function(grunt) {

  var path = require('path'),
      Mocha = require('mocha'),
      domain = require('domain');


  grunt.registerMultiTask('simplemocha', 'Run tests with mocha', function() {
    process.on('uncaughtException', function(err) {
      console.log('I caught an error and I liked it');
    });

    var gruntThis = this;
    var d = domain.create();

    d.on('error', function(err) {
      console.log('error time')
    });

    d.on('uncaughtException', function(err) {
      console.log('exception time!');
    });

    d.run(function() {
      throw new Error('here is an error');
      var options = gruntThis.options(),
          mocha_instance = new Mocha(options);

      gruntThis.filesSrc.forEach(mocha_instance.addFile.bind(mocha_instance));

      // We will now run mocha asynchronously and receive number of errors in a
      // callback, which we'll use to report the result of the async task by
      // calling done() with the appropriate value to indicate whether an error
      // occurred.

      var done = gruntThis.async();

      mocha_instance.run(function(errCount) {
        var withoutErrors = (errCount === 0);
        done(withoutErrors);
      });
    });
  });
};
