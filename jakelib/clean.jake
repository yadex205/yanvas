/* global task, desc, complete, fail */

const rimraf = require('rimraf')

const path = require('path')

desc('Clean dist directory')
task('clean', { async: true }, () => {
  rimraf(path.join(__dirname, '../dist/**/*'), (error) => {
    !error ? complete() : fail(error)
  })
})
