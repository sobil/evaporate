#!/usr/bin/env ts-node
'use strict'
exports.__esModule = true
exports.upsert = exports.areWeTestingWithJest = exports.main = void 0
var commander_1 = require('commander')
var package_json_1 = require('./utils/package-json')
var upsert_1 = require('./commands/upsert')
exports.upsert = upsert_1.upsert
var packageJson = package_json_1['default']()
commander_1.program
  .version(packageJson.version || '0.0.1')
  .description(packageJson.description || 'Evaporate')
  .arguments('COMMAND')
  .option('-V, --verbose')
  .option('-R, --defualt-region <REGION>', 'AWS Region')
commander_1.program
  .option('-s, --stack-name <STACK_NAME>', 'Stack Name')
  .option('-d, --dry-run')
  .option('-f, --on-create-fail <FAUILURE_BEHAVIOUR>', 'Failure Behaviour')
commander_1.program.parse(process.argv)
function main() {
  console.log(commander_1.program.args)
}
exports.main = main
function areWeTestingWithJest() {
  return process.env.JEST_WORKER_ID !== undefined
}
exports.areWeTestingWithJest = areWeTestingWithJest
areWeTestingWithJest() ? main() : null // eslint-disable-line
