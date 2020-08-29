/**
 * Initialize all the gulp dependencies
 * @gulp-rename is to rename files
 * @gulp-uglify Uglify js files
 * @gulp-minify-css Minify css files
 * @gulp-clean delete compiled files
 */
var { gulp, src, dest, watch, lastRun, series, parallel } = require("gulp");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var minify = require("gulp-minify-css");
var clean = require("gulp-clean");

/**
 * Perform JS uglification
 * @sourcemaps : created a map file for js files
 * @lastRun : Retrieves the last time a task was successfully completed during the current running process and enables incremental builds to speed up execution times by skipping files that haven't changed since the last successful task completion.
 */
function processJs() {
  return src("js/*.js", { sourcemaps: true, since: lastRun(processJs) })
    .pipe(uglify())
    .pipe(rename({ extname: ".min.js" }))
    .pipe(dest("dist/js", { sourcemaps: "." }));
}

/**
 * Perform CSS minification
 */
function processCss() {
  return src(["css-grid/*.css", "flexbox-grid/*.css", "float/*.css"], {
    since: lastRun(processCss),
  })
    .pipe(minify())
    .pipe(rename({ extname: ".min.css" }))
    .pipe(dest("dist/css"));
}

/**
 * Export as an independent tasks
 * gulp processJs
 * gulp processCss
 */
exports.processJs = processJs;
exports.processCss = processCss;

/**
 * The default gulp function.
 * watcher added for js and css files.
 * @ignoreInitial : Runs for the first time also when gulp command is run
 */
exports.default = function () {
  watch("js/*.js", { events: "all", ignoreInitial: false }, processJs);
  watch(
    ["css-grid/*.css", "flexbox-grid/*.css", "float/*.css"],
    { events: "all", ignoreInitial: false },
    processCss
  );
};
