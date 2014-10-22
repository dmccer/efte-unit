var gulp = require('gulp');
var compiler = require('gulp-cortex-handlebars-compiler');
var less = require('gulp-less');
var path = require('path');

gulp.task('less', function() {
  gulp.src('./less/page/**/*.less')
    .pipe(less({
      paths: [path.join(__dirname, 'less', 'base'), path.join(__dirname, 'less', 'component')]
    }))
    .pipe(gulp.dest('src/css/'));

  gulp.src('./less/common/img/**/*.*')
    .pipe(gulp.dest('src/img'));

  gulp.src('./less/img/**/*.*')
    .pipe(gulp.dest('src/img'));
});

gulp.task('handlebar', function() {
  gulp.src(["handlebar/**/*.html"])
    .pipe(compiler({
      // `cortex build` might be executed inside a sub directory
      cwd: __dirname,
      href_root: process.env.CORTEX_EFTE_HREF_ROOT,
      js_ext: process.env.CORTEX_EFTE_JS_EXT || '.js',
      css_ext: process.env.CORTEX_EFTE_CSS_EXT || '.css'

    }).compile())
    .pipe(gulp.dest("src/"));
});

gulp.task('default', ['less', 'handlebar'])
