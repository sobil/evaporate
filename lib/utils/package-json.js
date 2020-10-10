'use strict'
exports.__esModule = true
var jsonfile = require('jsonfile')
var file = require('fs')
var findPackageJson = function () {
  var path = file.realpathSync(__dirname)
  while (path !== '/') {
    if (file.existsSync(path + '/package.json')) {
      console.log('Found package.json at ' + path)
      return path + '/package.json'
    }
    path = file.realpathSync(path + '/../')
  }
  return null
}
var getPackageJson = function () {
  var packageJsonPath = findPackageJson()
  if (packageJsonPath) {
    return jsonfile.readFileSync(packageJsonPath)
  }
  throw Error('package.json Not Found')
}
exports['default'] = getPackageJson
