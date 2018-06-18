var gulp = require("gulp");
var sass = require("gulp-sass");
var header = require("gulp-header");
var cleanCSS = require("gulp-clean-css");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var pkg = require("./package.json");
var browserSync = require("browser-sync").create();
var del = require("del");
var serve = require("gulp-serve");

// Copy third party libraries from /node_modules into /vendor
gulp.task("vendor", function() {
  // Bootstrap
  gulp
    .src([
      "./node_modules/bootstrap/dist/**/*",
      "!./node_modules/bootstrap/dist/css/bootstrap-grid*",
      "!./node_modules/bootstrap/dist/css/bootstrap-reboot*"
    ])
    .pipe(gulp.dest("./vendor/bootstrap"));

  // Devicons
  gulp
    .src([
      "./node_modules/devicons/**/*",
      "!./node_modules/devicons/*.json",
      "!./node_modules/devicons/*.md",
      "!./node_modules/devicons/!PNG",
      "!./node_modules/devicons/!PNG/**/*",
      "!./node_modules/devicons/!SVG",
      "!./node_modules/devicons/!SVG/**/*"
    ])
    .pipe(gulp.dest("./vendor/devicons"));

    // Devicon
    gulp
      .src([
        "./node_modules/devicon/**/*",
        "!./node_modules/devicon/*.json",
        "!./node_modules/devicon/*.md",
        "!./node_modules/devicon/gulpfile.js",
        "!./node_modules/devicon/LICENSE",
        "!./node_modules/devicon/*.html",
        "!./node_modules/devicon/icons/**/*.eps"
      ])
      .pipe(gulp.dest("./vendor/devicon"));

  // Font Awesome
  gulp
    .src([
      "./node_modules/font-awesome/**/*",
      "!./node_modules/font-awesome/{less,less/*}",
      "!./node_modules/font-awesome/{scss,scss/*}",
      "!./node_modules/font-awesome/.*",
      "!./node_modules/font-awesome/*.{txt,json,md}"
    ])
    .pipe(gulp.dest("./vendor/font-awesome"));

  // jQuery
  gulp
    .src([
      "./node_modules/jquery/dist/*",
      "!./node_modules/jquery/dist/core.js"
    ])
    .pipe(gulp.dest("./vendor/jquery"));

  // jQuery Easing
  gulp
    .src(["./node_modules/jquery.easing/*.js"])
    .pipe(gulp.dest("./vendor/jquery-easing"));

  // Simple Line Icons
  gulp
    .src(["./node_modules/simple-line-icons/fonts/**"])
    .pipe(gulp.dest("./vendor/simple-line-icons/fonts"));

  gulp
    .src(["./node_modules/simple-line-icons/css/**"])
    .pipe(gulp.dest("./vendor/simple-line-icons/css"));
});

// Compile SCSS
gulp.task("css:compile", function() {
  return gulp
    .src("./scss/**/*.scss")
    .pipe(
      sass
        .sync({
          outputStyle: "expanded"
        })
        .on("error", sass.logError)
    )
    .pipe(gulp.dest("./css"));
});

// Minify CSS
gulp.task("css:minify", ["css:compile"], function() {
  return gulp
    .src(["./css/*.css", "!./css/*.min.css"])
    .pipe(cleanCSS())
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(gulp.dest("./css"))
    .pipe(browserSync.stream());
});

// CSS
gulp.task("css", ["css:compile", "css:minify"]);

// Minify JavaScript
gulp.task("js:minify", function() {
  return gulp
    .src(["./js/*.js", "!./js/*.min.js"])
    .pipe(uglify())
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(gulp.dest("./js"))
    .pipe(browserSync.stream());
});

// JS
gulp.task("js", ["js:minify"]);

// Default task
gulp.task("default", ["css", "js", "vendor"]);

// Configure the browserSync task
gulp.task("browserSync", function() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
});

// Dev task
gulp.task("dev", ["css", "js", "browserSync"], function() {
  gulp.watch("./scss/*.scss", ["css"]);
  gulp.watch("./js/*.js", ["js"]);
  gulp.watch("./*.html", browserSync.reload);
});

//Clean dist folder
gulp.task("clean:dist", function() {
  return del(["dist/**/*"]);
});

// Dist task
gulp.task("build:dist", ["clean:dist", "default"], function() {
  gulp.src(["./css/*.min.css"]).pipe(gulp.dest("./dist/css"));
  gulp.src(["./js/*.min.js"]).pipe(gulp.dest("./dist/js"));
  gulp.src(["./img/*"]).pipe(gulp.dest("./dist/img"));
  gulp
    .src(["./vendor/bootstrap/css/bootstrap.min.css"])
    .pipe(gulp.dest("./dist/vendor/bootstrap/css"));
  gulp
    .src(["./vendor/bootstrap/js/bootstrap.bundle.min.js"])
    .pipe(gulp.dest("./dist/vendor/bootstrap/js"));
  gulp
    .src(["./vendor/devicons/css/*.min.css"])
    .pipe(gulp.dest("./dist/vendor/devicons/css"));
  gulp
    .src(["./vendor/devicons/fonts/*"])
    .pipe(gulp.dest("./dist/vendor/devicons/fonts"));
  gulp
    .src(["./vendor/font-awesome/css/*.min.css"])
    .pipe(gulp.dest("./dist/vendor/font-awesome/css"));
  gulp
    .src(["./vendor/font-awesome/fonts/*"])
    .pipe(gulp.dest("./dist/vendor/font-awesome/fonts"));
  gulp
    .src(["./vendor/jquery/jquery.min.js"])
    .pipe(gulp.dest("./dist/vendor/jquery"));
  gulp
    .src(["./vendor/jquery-easing/*.min.js"])
    .pipe(gulp.dest("./dist/vendor/jquery-easing"));
  gulp
    .src(["./vendor/simple-line-icons/css/simple-line-icons.css"])
    .pipe(gulp.dest("./dist/vendor/simple-line-icons/css"));
  gulp
    .src(["./vendor/simple-line-icons/fonts/*"])
    .pipe(gulp.dest("./dist/vendor/simple-line-icons/fonts"));
  gulp.src(["index.html"]).pipe(gulp.dest("./dist"));
});

gulp.task('dist', ['build:dist'], serve({root: 'dist', port: 3030}));