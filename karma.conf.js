// karma.conf.js
module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],
        browsers: ['PhantomJS'],
        files: [
            'vnerv.js',
            'spec/tests.js'
        ]
    });
};