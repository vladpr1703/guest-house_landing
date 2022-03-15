import gulp from "gulp";
import { path } from "./gulp/config/path.js";
import { plugins } from "./gulp/config/plugins.js";

import { copy, reset, html, server } from "./gulp/tasks/index.js";

global.app = {
  path,
  gulp,
  plugins,
};

function watcher() {
  gulp.watch(path.watch.files, copy);
  gulp.watch(path.watch.html, html);
}

const mainTasks = gulp.parallel(copy, html);

const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));

gulp.task("default", dev);
