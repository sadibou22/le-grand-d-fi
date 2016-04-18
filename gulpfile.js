var gulp = require('gulp'),
    wiredep = require('wiredep'),
    inject = require('gulp-inject'),
    gulpFilter = require('gulp-filter'),
    mainBowerFiles = require('main-bower-files');

gulp.task('inject', ['injectBower', 'injectApp'], function() {
});

gulp.task('injectBower', function() {
    var stream = wiredep.stream,
        bowerOptions = {
            bowerJson: require('./bower.json'),
            directory: './public/bower',
            ignorePath: '../../public'
        };
    return gulp.src('./views/layouts/*.html')
        .pipe(stream(bowerOptions))
        .pipe(gulp.dest('./views/layouts'));
});

gulp.task('injectApp', ['copyApp'], function() {
    var injectOptions = {
        ignorePath: '/public'
    },
        injectSrc = gulp.src([
            './public/dist/js/**/*.js',
            './public/dist/css/**/*.css'],
            {
                read: false
            });
    return gulp.src('./views/layouts/*.html')
        .pipe(inject(injectSrc, injectOptions))
        .pipe(gulp.dest('./views/layouts'));
});
gulp.task('copyApp', function() {
    var path = './public/dist';
    var jsFilter = gulpFilter('**/*.js', {
        restore: true
    });
    var cssFilter = gulpFilter('**/*.css', {
        restore: true
    });
    return gulp.src([
        './public/js/**/*.js',
        './public/css/**/*.css'])
        // copy app js
        .pipe(jsFilter)
        .pipe(gulp.dest(path + '/js/'))
        .pipe(jsFilter.restore)
        // copy app css
        .pipe(cssFilter)
        .pipe(gulp.dest(path + '/css/'))
        .pipe(cssFilter.restore);
});