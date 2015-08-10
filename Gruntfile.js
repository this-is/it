module.exports = function(grunt) {
    "use strict";
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                mangle: true
            },
            bundled: {
                "src": "./dist/js/it.bundled.js",
                "dest": "./dist/js/it.bundled.min.js"
            },
            core: {
                "src": "./src/js/it.js",
                "dest": "./dist/js/it.min.js"
            }
        },
        clean: {
            src: ["dist/**/*"]
        },
        concat: {
            options: {
                separator: ';'
            },
            js: {
                src: ['./src/js/it.js', './src/js/it.validators.js'],
                dest: './dist/js/it.bundled.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.registerTask('cleanAll', ['clean']);
    grunt.registerTask('build', ['clean', 'concat:js', 'uglify:core', 'uglify:bundled']);
};
