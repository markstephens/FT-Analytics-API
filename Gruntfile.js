"use strict";

module.exports = function (grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        //qunit: {
        //    files: ['test/**/*.html']
        //},

        jshint: {
            files: ['**/*.js'],
            options: {
                forin: true,
                noarg: true,
                noempty: true,
                eqeqeq: true,
                bitwise: true,
                strict: true,
                undef: true,
                unused: true,
                curly: true,
                browser: true,
                node: true,
                newcap: true,
                immed: true,
                trailing: true,
                smarttabs: true,

                // options here to override JSHint defaults
                ignores: ['node_modules/**/*.js', 'public/js/vendor/**/*.js']
            }
        },

        shell : {
            logs : {
                command: 'rm *.log'
            },
            flush_cache : {
                command: "echo 'flush_all' | nc localhost 11211"
            }

        }

    });

    grunt.registerTask('default', "Default.", ['test']);

    grunt.registerTask('test', "Run tests.", ['jshint']);
    grunt.registerTask('logs', "Cycle the log files", ['shell:logs']);
    grunt.registerTask('flush_cache', "Clear local memcache", ['shell:flush_cache']);


    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-shell');
    //grunt.loadNpmTasks('grunt-contrib-qunit');
};