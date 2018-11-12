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
gulp.task("vendor", function(done) {
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

    gulp
        .src("./node_modules/rss-parser/dist/rss-parser.min.js")
        .pipe(gulp.dest("./vendor/rss-parser"));
    done();
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
gulp.task("css:minify", gulp.series("css:compile", function() {
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
}));

// CSS
gulp.task("css", gulp.series(["css:compile", "css:minify"]));

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
gulp.task("js", gulp.series("js:minify"));

// Default task
gulp.task("default", gulp.series(["css", "js", "vendor"]));

// Configure the browserSync task
gulp.task("browserSync", function(done) {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    done();
});

// Dev task
gulp.task("dev", gulp.series(["css", "js", "browserSync"], function(done) {
    gulp.watch("./scss/*.scss", gulp.series("css"));
    gulp.watch("./js/*.js", gulp.series("js"));
    gulp.watch("./*.html", gulp.series(browserSync.reload));
    done();
}));

//Clean dist folder
gulp.task("clean:dist", function() {
    return del(["dist/**/*"]);
});

// Dist task
gulp.task("build:dist", gulp.series(["clean:dist", "default"], function(done) {
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
        .src([
            "./vendor/devicon/devicon-colors.css",
            "./vendor/devicon/devicon.min.css"
        ])
        .pipe(gulp.dest("./dist/vendor/devicon"));
    gulp
        .src(["./vendor/devicon/fonts/*"])
        .pipe(gulp.dest("./dist/vendor/devicon/fonts"));
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
        .src("./vendor/rss-parser/rss-parser.min.js")
        .pipe(gulp.dest("./dist/vendor/rss-parser"));
    gulp
        .src(["./vendor/jquery-easing/*.min.js"])
        .pipe(gulp.dest("./dist/vendor/jquery-easing"));
    gulp
        .src(["./vendor/simple-line-icons/css/simple-line-icons.css"])
        .pipe(gulp.dest("./dist/vendor/simple-line-icons/css"));
    gulp
        .src(["./vendor/simple-line-icons/fonts/*"])
        .pipe(gulp.dest("./dist/vendor/simple-line-icons/fonts"));
    gulp.src([
        "*.html",
        "*.png",
        "*.ico",
        "*.svg",
        "site.webmanifest",
        "browserconfig.xml"
    ]).pipe(gulp.dest("./dist"));
    gulp.src(["mailer.php"]).pipe(gulp.dest("./dist"));
    done();
}));

gulp.task("dist", gulp.series("build:dist", serve({ root: "dist", port: 3030 })));