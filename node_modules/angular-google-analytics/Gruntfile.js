/* global require, module */
module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/**\n' +
      ' * <%= pkg.description %>\n' +
      ' * @version v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
      ' * @link <%= pkg.homepage %>\n' +
      ' * @author <%= pkg.author %>\n' +
      ' * @contributors <%= pkg.contributors %>\n' +
      ' * @license MIT License, http://www.opensource.org/licenses/MIT\n' +
      ' */\n'
    },
    dirs: {
      dest: 'dist'
    },
    concat: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        src: ['index.js'],
        dest: '<%= dirs.dest %>/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        src: ['<%= concat.dist.dest %>'],
        dest: '<%= dirs.dest %>/<%= pkg.name %>.min.js'
      }
    },
    stage: {},
    release: {
      options: {
        commitMessage: '<%= version %>',
        tagName: '<%= version %>',
        file: 'package.json',
        push: false,
        tag: false,
        pushTags: false,
        npm: false
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'index.js', 'test/*.js', 'test/unit/*.js'],
      options: {
        curly: true,
        browser: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        expr: true,
        node: true,
        '-W018': true,
        globals: {
          exports: true,
          angular: false,
          $: false
        }
      }
    },
    karma: {
      test: {
        options: {
          reporters: ['dots'],
          singleRun: true
        }
      },
      server: {
        options: {
          singleRun: false
        }
      },
      options: {
        configFile: __dirname + '/test/karma.conf.js'
      }
    }
  });

  // Load the plugin that provides the "jshint" task.
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Load the plugin that provides the "concat" task.
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('stage', 'git add files before running the release task', function () {
    var files = this.options().files;
    grunt.util.spawn({
      cmd: process.platform === 'win32' ? 'git.cmd' : 'git',
      args: ['add'].concat(files)
    }, grunt.task.current.async());
  });

  // Default task.
  grunt.registerTask('default', ['test']);

  // Static analysis
  grunt.registerTask('lint', ['jshint']);

  // Test tasks.
  grunt.registerTask('test', ['jshint', 'karma:test']);
  grunt.registerTask('test-server', ['karma:server']);

  // Build task.
  grunt.registerTask('build', ['test', 'concat', 'uglify']);

  // Release task.
  grunt.registerTask('release', ['build']);

  // Provides the "karma" task.
  grunt.registerMultiTask('karma', 'Starts up a karma server.', function() {
    var karma = require('karma'),
        done = this.async();
    var server = new karma.Server(this.options(), function(code) {
      done(code === 0);
    });
    server.start();
  });
};
