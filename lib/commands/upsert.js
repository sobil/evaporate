'use strict'
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1]
          return t[1]
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this
        }),
      g
    )
    function verb(n) {
      return function (v) {
        return step([n, v])
      }
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.')
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t
          if (((y = 0), t)) op = [op[0] & 2, t.value]
          switch (op[0]) {
            case 0:
            case 1:
              t = op
              break
            case 4:
              _.label++
              return { value: op[1], done: false }
            case 5:
              _.label++
              y = op[1]
              op = [0]
              continue
            case 7:
              op = _.ops.pop()
              _.trys.pop()
              continue
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0
                continue
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1]
                break
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1]
                t = op
                break
              }
              if (t && _.label < t[2]) {
                _.label = t[2]
                _.ops.push(op)
                break
              }
              if (t[2]) _.ops.pop()
              _.trys.pop()
              continue
          }
          op = body.call(thisArg, _)
        } catch (e) {
          op = [6, e]
          y = 0
        } finally {
          f = t = 0
        }
      if (op[0] & 5) throw op[1]
      return { value: op[0] ? op[1] : void 0, done: true }
    }
  }
var __asyncValues =
  (this && this.__asyncValues) ||
  function (o) {
    if (!Symbol.asyncIterator)
      throw new TypeError('Symbol.asyncIterator is not defined.')
    var m = o[Symbol.asyncIterator],
      i
    return m
      ? m.call(o)
      : ((o =
          typeof __values === 'function' ? __values(o) : o[Symbol.iterator]()),
        (i = {}),
        verb('next'),
        verb('throw'),
        verb('return'),
        (i[Symbol.asyncIterator] = function () {
          return this
        }),
        i)
    function verb(n) {
      i[n] =
        o[n] &&
        function (v) {
          return new Promise(function (resolve, reject) {
            ;(v = o[n](v)), settle(resolve, reject, v.done, v.value)
          })
        }
    }
    function settle(resolve, reject, d, v) {
      Promise.resolve(v).then(function (v) {
        resolve({ value: v, done: d })
      }, reject)
    }
  }
exports.__esModule = true
exports.upsert = void 0
var DEFAULTS = require('../utils/defaults')
var aws_1 = require('../utils/aws')
var fs = require('fs')
var YAML = require('yaml')
exports.upsert = function (path, fileName) {
  return __awaiter(void 0, void 0, void 0, function () {
    var stack,
      evaporateFile,
      evaporateFileContent,
      currentAccID,
      evaporateConfig,
      zonesForCurrentAccount,
      zonesForCurrentAccount_1,
      zonesForCurrentAccount_1_1,
      stackName,
      stackParms,
      _a,
      _b,
      _c,
      _d,
      zone,
      filePath,
      e_1,
      e_2_1,
      e_3_1
    var e_3, _e, e_2, _f
    return __generator(this, function (_g) {
      switch (_g.label) {
        case 0:
          stack = {}
          evaporateFile =
            typeof fileName === 'string'
              ? path + '/' + fileName
              : path + '/' + DEFAULTS.evaporateFile
          if (!fs.existsSync(evaporateFile)) {
            throw new Error('File not Found:' + path + '/' + fileName)
          }
          evaporateFileContent = fs.readFileSync(evaporateFile, {
            encoding: 'utf8',
          })
          return [4 /*yield*/, aws_1.getCurrentAccountID()]
        case 1:
          currentAccID = _g.sent() || ''
          evaporateConfig = YAML.parse(evaporateFileContent)
          zonesForCurrentAccount = Object.keys(evaporateConfig).filter(
            function (stackName) {
              return Object.keys(
                evaporateConfig[stackName].parameters,
              ).includes(currentAccID)
            },
          )
          _g.label = 2
        case 2:
          _g.trys.push([2, 23, 24, 29])
          zonesForCurrentAccount_1 = __asyncValues(zonesForCurrentAccount)
          _g.label = 3
        case 3:
          return [4 /*yield*/, zonesForCurrentAccount_1.next()]
        case 4:
          if (
            !((zonesForCurrentAccount_1_1 = _g.sent()),
            !zonesForCurrentAccount_1_1.done)
          )
            return [3 /*break*/, 22]
          stackName = zonesForCurrentAccount_1_1.value
          console.log('Upserting: ' + path)
          stackParms = Object.keys(
            evaporateConfig[stackName].parameters[currentAccID],
          ).map(function (key) {
            return {
              ParameterKey: key,
              ParameterValue:
                evaporateConfig[stackName].parameters[currentAccID][key],
            }
          })
          console.log('Operation on account ' + currentAccID)
          _a = stack
          _b = stackName
          return [
            4 /*yield*/,
            aws_1.upsertTemplate(
              path + '/' + evaporateConfig[stackName]['template-path'],
              stackParms,
              stackName,
            ),
          ]
        case 5:
          _a[_b] = _g.sent()
          if (!Object.keys(evaporateConfig[stackName]).includes('r53zones'))
            return [3 /*break*/, 20]
          _g.label = 6
        case 6:
          _g.trys.push([6, 14, 15, 20])
          _c =
            ((e_2 = void 0), __asyncValues(evaporateConfig[stackName].r53zones))
          _g.label = 7
        case 7:
          return [4 /*yield*/, _c.next()]
        case 8:
          if (!((_d = _g.sent()), !_d.done)) return [3 /*break*/, 13]
          zone = _d.value
          _g.label = 9
        case 9:
          _g.trys.push([9, 11, , 12])
          filePath = path + '/' + zone.zoneFile
          return [
            4 /*yield*/,
            aws_1.route53ZoneUpdate(
              evalRef(zone.zoneId)(stack),
              fs.realpathSync(filePath),
            ),
          ]
        case 10:
          _g.sent()
          return [3 /*break*/, 12]
        case 11:
          e_1 = _g.sent()
          console.error('fail cli53:', e_1.message)
          return [3 /*break*/, 12]
        case 12:
          return [3 /*break*/, 7]
        case 13:
          return [3 /*break*/, 20]
        case 14:
          e_2_1 = _g.sent()
          e_2 = { error: e_2_1 }
          return [3 /*break*/, 20]
        case 15:
          _g.trys.push([15, , 18, 19])
          if (!(_d && !_d.done && (_f = _c['return']))) return [3 /*break*/, 17]
          return [4 /*yield*/, _f.call(_c)]
        case 16:
          _g.sent()
          _g.label = 17
        case 17:
          return [3 /*break*/, 19]
        case 18:
          if (e_2) throw e_2.error
          return [7 /*endfinally*/]
        case 19:
          return [7 /*endfinally*/]
        case 20:
          console.log('Completed ' + path)
          return [2 /*return*/]
        case 21:
          return [3 /*break*/, 3]
        case 22:
          return [3 /*break*/, 29]
        case 23:
          e_3_1 = _g.sent()
          e_3 = { error: e_3_1 }
          return [3 /*break*/, 29]
        case 24:
          _g.trys.push([24, , 27, 28])
          if (
            !(
              zonesForCurrentAccount_1_1 &&
              !zonesForCurrentAccount_1_1.done &&
              (_e = zonesForCurrentAccount_1['return'])
            )
          )
            return [3 /*break*/, 26]
          return [4 /*yield*/, _e.call(zonesForCurrentAccount_1)]
        case 25:
          _g.sent()
          _g.label = 26
        case 26:
          return [3 /*break*/, 28]
        case 27:
          if (e_3) throw e_3.error
          return [7 /*endfinally*/]
        case 28:
          return [7 /*endfinally*/]
        case 29:
          return [2 /*return*/]
      }
    })
  })
}
