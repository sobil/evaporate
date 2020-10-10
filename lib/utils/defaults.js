'use strict'
exports.__esModule = true
exports.waitForStatuses = exports.awsRetryWaitSeconds = exports.timeoutSeconds = exports.evaporateFile = void 0
exports.evaporateFile = 'evaporate.yaml'
exports.timeoutSeconds = 900 // 15 minutes
exports.awsRetryWaitSeconds = 10 // 10 seconds
exports.waitForStatuses = [
  'CREATE_IN_PROGRESS',
  'UPDATE_IN_PROGRESS',
  'UPDATE_COMPLETE_CLEANUP_IN_PROGRESS',
]
