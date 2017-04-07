const gulp = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const cssmin = require('gulp-minify-css');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const jshint = require('gulp-jshint');
const scsslint = require('gulp-sass-lint');
const cache = require('gulp-cached');
const prefix = require('gulp-autoprefixer');
const browserSync = require('browser-sync');
const size = require('gulp-size');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const plumber = require('gulp-plumber');
const babel = require('gulp-babel');
const notify = require('gulp-notify');
const fileinclude = require('gulp-file-include');
const sourcemaps = require('gulp-sourcemaps');
const deploy = require('gulp-gh-pages');

const reload = browserSync.reload;

gulp.task('scss', () => {
  function onError(err) {
    notify.onError({
      title: 'Gulp',
      subtitle: 'Sass error!',
      message: 'Error: <%= error.message %>',
      sound: 'Beep',
    })(err);
    this.emit('end');
  }

  return gulp.src('src/scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(plumber({
      errorHandler: onError,
    }))
    .pipe(sass())
    .pipe(size({
      gzip: true,
      showFiles: true,
    }))
    .pipe(prefix({
      browsers: ['last 2 versions'],
    }))
    .pipe(rename('j.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(cssmin())
    .pipe(size({
      gzip: true,
      showFiles: true,
    }))
    .pipe(rename({
      suffix: '.min',
    }))
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('dist/css'))
    .pipe(reload({
      stream: true,
    }));
});

gulp.task('js', () => {
  gulp.src('src/js/*.js')
    .pipe(babel({
      presets: ['es2015', 'es2016', 'es2017', 'stage-2'],
    }))
    .pipe(size({
      gzip: true,
      showFiles: true,
    }))
    .pipe(concat('j.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min',
    }))
    .pipe(gulp.dest('dist/js'))
    .pipe(reload({
      stream: true,
    }));
});

gulp.task('scss-lint', () => {
  gulp.src('src/scss/**/*.scss')
    .pipe(cache('scsslint'))
    .pipe(scsslint());
});

gulp.task('jshint', () => {
  gulp.src('src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('imgmin', () => {
  gulp.src('src/img/**/*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false,
      }],
      use: [pngquant()],
    }))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('fileinclude', () => {
  gulp.src('src/html/*.html')
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file',
      indent: true,
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('copystatic', () => {
  gulp.src(['src/*', '!src/html', '!src/img', '!src/js', '!src/scss'])
    .pipe(gulp.dest('dist'));
  gulp.src('src/js/vendor/*.js')
    .pipe(gulp.dest('dist/js/vendor'));
});

gulp.task('browser-sync', () => browserSync({
  server: {
    baseDir: './dist/',
  },
  open: true,
}));

gulp.task('deploy', () => gulp.src('dist/**/*')
  .pipe(deploy()));

gulp.task('watch', () => {
  gulp.watch('src/scss/**/*.scss', ['scss']);
  gulp.watch('src/js/*.js', ['jshint', 'js']);
  gulp.watch('src/img/*', ['imgmin']);
  gulp.watch('src/html/**/*.html', ['fileinclude', reload]);
});

gulp.task('default', ['copystatic', 'fileinclude', 'js', 'imgmin', 'scss', 'watch'], () => {
  gulp.start('browser-sync');
});

gulp.task('build', ['copystatic', 'fileinclude', 'js', 'imgmin', 'scss']);
