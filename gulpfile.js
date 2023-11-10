const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();

const paths = {
  root: './',
  sass: './sass/*.sass',
  innerSass: './sass/**/*.sass',
};

function style() {
  return gulp
    .src(paths.sass)
    .pipe(sass({ indentedSyntax: true }).on('error', sass.logError))
    .pipe(gulp.dest(paths.root))
    .pipe(browserSync.stream());
}

function serve() {
  browserSync.init({
    port: 2233,
    server: paths.root,
    startPath: 'dev.html',
  });

  gulp.watch([paths.sass, paths.innerSass], style);
  gulp.watch(paths.root + '*.html').on('change', browserSync.reload);
}

function build(done) {
  style();
  done();
}

exports.default = serve;
exports.build = build;
