/* global task, desc, namespace, complete, fail */

const browserify = require('browserify')
const watchify   = require('watchify')
const babelify   = require('babelify')
const brfs       = require('brfs')
const exorcist   = require('exorcist')
const fs         = require('fs')
const makeDir    = require('make-dir')

desc('Watch source updates and build immediately')
task('watch', ['clean', 'watch:transpile'])

namespace('watch', () => {
  task('transpile', { async: true }, async () => {
    await makeDir('dist')

    let stream = fs.createWriteStream('./dist/yanvas.min.js')
        .on('finish', complete)
        .on('error', fail)

    browserify('./lib/yanvas.js', { debug: true })
      .plugin(watchify)
      .transform(brfs)
      .transform(babelify)
      .bundle()
      .pipe(exorcist('./dist/yanvas.min.js.map'))
      .pipe(stream)
  })
})
