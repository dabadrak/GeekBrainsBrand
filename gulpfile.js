let gulp = require('gulp'), //Подключаем сам gulp
    sass = require('gulp-sass'), // Компиляция sass в css
    uglifyJs = require('gulp-uglifyes'), // Минификация js
    autoPrefixer = require('gulp-autoprefixer'), // Вендорные префиксы
    bs = require('browser-sync'), // Server
    htmlMin = require('gulp-htmlmin'), // Минификация html
    rename = require('gulp-rename'), // Rename
    delFiles = require('del'), // Delete files
    cssMinify = require('gulp-csso'), // Css minify
    babel = require('gulp-babel'), // Babel
    imageMin = require('gulp-imagemin'); // ImageMin

// Методы
// gulp.task() - создание новой задачи
// gulp.src() - получение файлов
// gulp.dest() - сохранение файлов
// gulp.series() - запуск задач по порядку (по порядку аргументов)
// gulp.parallel() - запуск задач параллельно
// gulp.watch() - следит за файлами

gulp.task('test', () => {
  return console.log('Gulp works!');
});

gulp.task('html', () => {
  return gulp.src('app/html/*.html') // Выбираем файлы
      .pipe(htmlMin({collapseWhitespace: true})) // 1 обработка: минифицируем файл
      .pipe(gulp.dest('dist')); // 2 обработка: сохраняем файл
});

gulp.task('clear', () => {
  return delFiles(['dist/**', 'dist/**/*.*', '!dist', '!dist/packages/**', "!dist/bower_components/**"])
});

gulp.task('sass', () => {
  // return gulp.src('app/sass/**/*.+(scss|sass)');
  // return gulp.src('app/img/**/*.+(jpg|png|gif|svg)');
  return gulp.src('app/sass/**/*.sass')
      .pipe(sass())
      .pipe(autoPrefixer())
      .pipe(cssMinify())
      .pipe(gulp.dest('dist/css'))
});
gulp.task('js:es6', () => {
  return gulp.src('app/js/**/*.js')
      .pipe(uglifyJs())
      .pipe(rename({
        suffix: '.min'
      }))
      .pipe(gulp.dest('dist/js'))
});
gulp.task('babel', () => {
  return gulp.src('app/js/**/*.js')
      .pipe(babel({
        presets: ['@babel/env']
      }))
      .pipe(rename({
        suffix: '.es5'
      }))
      .pipe(gulp.dest('dist/js'))
});

gulp.task('imageMin', () => {
  return gulp.src('app/img/*')
      .pipe(imageMin())
      .pipe(gulp.dest('dist/img'))
});

gulp.task('json', () => {
  return gulp.src('app/json/*')
      .pipe(gulp.dest('dist/json'))
});

gulp.task('server', () => {
  return bs({
    browser: 'chrome',
    server: {
      baseDir: 'dist'
    }
  })
});

gulp.task('sass:watch', () => {
  return gulp.watch('app/sass/**/*.sass', gulp.series('sass', (done) => {
    bs.reload();
    done();
  }))
});
gulp.task('js:watch', () => {
  return gulp.watch('app/js/**/*.js', gulp.series('js:es6', (done) => {
    bs.reload();
    done();
  }))
});
gulp.task('img:watch', () => {
  return gulp.watch('app/img/*', gulp.series('imageMin', (done) => {
    bs.reload();
    done();
  }))
});
gulp.task('html:watch', () => {
  return gulp.watch('app/html/*.html', gulp.series('html', (done) => {
    bs.reload();
    done();
  }))
});

gulp.task('json:watch', () => {
  return gulp.watch('app/json/*.json', gulp.series('json', (done) => {
    bs.reload();
    done();
  }))
});

gulp.task('default', gulp.series('clear', gulp.parallel('html', 'imageMin', 'sass', 'js:es6', 'babel', 'json'),
    gulp.parallel('sass:watch', 'img:watch', 'html:watch', 'js:watch', 'json:watch', 'server')));