// �ޤJ�Ҧ��ݭn���ɮ�
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const htmlreplace = require('gulp-html-replace');
const source = require('vinyl-source-stream');
const browserify = require('browserify');
const watchify = require('watchify');
const babel = require('babelify');
const streamify = require('gulp-streamify');
// �ɮצ�m�Ѽ�
const path = {
  HTML: 'index.html',
  MINIFIED_OUT: 'bundle.min.js',
  OUT: 'bundle.js',
  DEST: 'dist',
  DEST_BUILD: 'dist/build',
  DEST_SRC: 'dist/src',
  ENTRY_POINT: './app/index.js'
};
// �ƻs html �� dist ��Ƨ���
gulp.task('copy', function(){
  gulp.src(path.HTML)
    .pipe(gulp.dest(path.DEST));
});
// ��ť�ɮ׬O�_���ܤơA�Y���ܤƫh���s�sĶ�@��
gulp.task('watch', function() {
  gulp.watch(path.HTML, ['copy']);
var watcher  = watchify(browserify({
    entries: [path.ENTRY_POINT],
    transform: [babel],
    debug: true,
  }));
return watcher.on('update', function () {
    watcher.bundle()
      .pipe(source(path.OUT))
      .pipe(gulp.dest(path.DEST_SRC))
      console.log('Updated');
  })
    .bundle()
    .pipe(source(path.OUT))
    .pipe(gulp.dest(path.DEST_SRC));
});
// ���� build production ���y�{�]�]�A uglify�B��Ķ���^
gulp.task('copy', function(){
  browserify({
    entries: [path.ENTRY_POINT],
    transform: [babel],
  })
    .bundle()
    .pipe(source(path.MINIFIED_OUT))
    .pipe(streamify(uglify(path.MINIFIED_OUT)))
    .pipe(gulp.dest(path.DEST_BUILD));
});
// �N script �ޥδ��� production ���ɮ�
gulp.task('replaceHTML', function(){
  gulp.src(path.HTML)
    .pipe(htmlreplace({
      'js': 'build/' + path.MINIFIED_OUT
    }))
    .pipe(gulp.dest(path.DEST));
});
// �]�w NODE_ENV �� production
gulp.task('apply-prod-environment', function() {
    process.env.NODE_ENV = 'production';
});
// �Y�������� gulp �|���� gulp default �����ȡGwatch�Bcopy�C�Y�] gulp production�A�h�|���� build�BreplaceHTML�Bapply-prod-environment
gulp.task('production', ['build', 'replaceHTML', 'apply-prod-environment']);
gulp.task('default', ['watch', 'copy']);