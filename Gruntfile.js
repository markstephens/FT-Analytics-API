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
            }

        }

    });

    grunt.registerTask('default', "Default.", ['test']);

    grunt.registerTask('test', "Run tests.", ['jshint']);
    grunt.registerTask('logs', "Cycle the log files", ['shell:logs']);


    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-shell');
    //grunt.loadNpmTasks('grunt-contrib-qunit');
};