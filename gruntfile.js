module.exports = function (grunt) {
    grunt.initConfig({
        sass: {
            dist: {
                options: {
                    outputStyle: 'expanded',
                    sourcemap: true
                },
                files: {
                    'dist/assets/css/applify.min.css': 'sass/style.scss',
                    'dist/assets/app/stylesheets/theme.css': 'dist/assets/app/stylesheets/sass/theme.scss',
                    'dist/assets/app/stylesheets/theme-admin-extension.css': 'dist/assets/app/stylesheets/sass/theme-admin-extension.scss',
                    'dist/assets/app/stylesheets/theme-custom.css': 'dist/assets/app/stylesheets/sass/theme-custom.scss'
                }
            }
        },
        uglify: {
            options: {
                mangle: false,
                compress: false,
                beautify: true
            },
            js:{
                files: {
                    'dist/assets/js/applify/build/applify.js': [
                        'dist/assets/js/applify/src/applify.js'
                    ],
                    'dist/assets/js/libs/bootstrap.js': [
                        'dist/assets/js/libs/imagesloaded/imagesloaded.js',
                        'dist/assets/js/libs/dotdotdot/dotdotdot.js',
                        'dist/assets/js/libs/bootstrap/popper.js',
                        'dist/assets/js/libs/bootstrap/util.js',
                        'dist/assets/js/libs/bootstrap/collapse.js',
                        'dist/assets/js/libs/bootstrap/tab.js',
                        'dist/assets/js/libs/bootstrap/modal.js',
                        'dist/assets/js/libs/bootstrap/dropdown.js'
                    ]
                }
            }
        },
        watch: {
            css: {
                files: ['sass/style.scss', 'sass/_*.scss', 'sass/*/_*.scss', 'sass/*/*/_*.scss'],
                tasks: ['sass']
            },
            js:  {
                files: [
                    'dist/assets/js/applify/src/*/*.js',
                    'dist/assets/js/applify/src/*.js'
                ],
                tasks: ['uglify']
            }
        }
    });

    // load plugins
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', [ 'watch' ]);
};