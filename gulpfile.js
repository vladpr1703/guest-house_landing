import gulp from "gulp";
import { path } from "./gulp/config/path.js";
import { plugins } from "./gulp/config/plugins.js";

import {
  copy,
  reset,
  html,
  server,
  scss,
  js,
  images,
  fontsStyle,
  ttfToWoff,
  otfToTtf,
} from "./gulp/tasks/index.js";

global.app = {
  isBuild: process.argv.includes("--build"),
  isDev: !process.argv.includes("--build"),
  path,
  gulp,
  plugins,
};

function watcher() {
  gulp.watch(path.watch.files, copy);
  gulp.watch(path.watch.html, html);
  gulp.watch(path.watch.scss, scss);
  gulp.watch(path.watch.js, js);
  gulp.watch(path.watch.images, images);
}

const fonts = gulp.series(otfToTtf, ttfToWoff, fontsStyle);

const mainTasks = gulp.parallel(copy, js, images, html, scss);

const dev = gulp.series(mainTasks, gulp.parallel(watcher, server));
const build = gulp.series(reset, mainTasks);

export { dev, build };
gulp.task("default", dev);
