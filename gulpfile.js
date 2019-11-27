var gulp = require('gulp');
 // 获取 gulp-ruby-sass 模块
var sass = require('gulp-sass')
var del = require('del');
gulp.task('scss',function(){
  return gulp.src('./scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./css'))
  })
  gulp.task('autoprefixer',['scss'], () => {
    const autoprefixer = require('autoprefixer')
    const sourcemaps = require('gulp-sourcemaps')
    const postcss = require('gulp-postcss')
  
    return gulp.src('./css/*.css')
      .pipe(sourcemaps.init())
      .pipe(postcss([ autoprefixer() ]))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./css'))
  })
gulp.task('watch-scss', function () {
    gulp.watch('./scss/**/*.scss',  ['scss','autoprefixer']); // 注意，任务列表是个数组，即使只有一个元素。
});
gulp.task('default',['watch-scss'])