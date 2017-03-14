module.exports = function (grunt)
{
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        eslint: {
            options: {
                configFile: '.eslintrc.json'
            },
            target: ['app/**/*.js', 'seed/**/*.js']
        }
    });

    grunt.registerTask('lint', ['eslint']);
};


