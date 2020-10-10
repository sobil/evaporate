"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.route53ZoneUpdate = exports.getCurrentAccountID = exports.upsertTemplate = void 0;
var aws_sdk_1 = require("aws-sdk");
var fs_1 = require("fs");
var DEFAULTS = require("./defaults");
var child_process_1 = require("child_process");
var cloudFormation = new aws_sdk_1.CloudFormation();
var sts = new aws_sdk_1.STS();
var sleep = function (millis) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, millis); })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var upsertTemplate = function (templatePath, Parameters, StackName) { return __awaiter(void 0, void 0, void 0, function () {
    var TemplateBody, stackDetails, err_1, err_2, err_3, time, stackStatus, stackOutput, _loop_1, state_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                TemplateBody = fs_1.readFileSync(templatePath, { encoding: 'utf8' });
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, cloudFormation.describeStacks({ StackName: StackName }).promise()];
            case 2:
                stackDetails = _b.sent();
                return [3 /*break*/, 4];
            case 3:
                err_1 = _b.sent();
                console.log('Could not get existing stack:', err_1.message);
                return [3 /*break*/, 4];
            case 4:
                if (!!stackDetails) return [3 /*break*/, 9];
                _b.label = 5;
            case 5:
                _b.trys.push([5, 7, , 8]);
                return [4 /*yield*/, cloudFormation
                        .createStack({ TemplateBody: TemplateBody, Parameters: Parameters, StackName: StackName })
                        .promise()];
            case 6:
                _b.sent();
                return [3 /*break*/, 8];
            case 7:
                err_2 = _b.sent();
                console.error('Could not create stack:', err_2.message);
                return [3 /*break*/, 8];
            case 8: return [3 /*break*/, 12];
            case 9:
                _b.trys.push([9, 11, , 12]);
                return [4 /*yield*/, cloudFormation
                        .updateStack({ TemplateBody: TemplateBody, Parameters: Parameters, StackName: StackName })
                        .promise()];
            case 10:
                _b.sent();
                return [3 /*break*/, 12];
            case 11:
                err_3 = _b.sent();
                console.log('No updates to stack:', err_3.message);
                return [3 /*break*/, 12];
            case 12:
                time = Date.now();
                stackStatus = 'UNKNOWN';
                _loop_1 = function () {
                    var err_4, replaceOutputs_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, cloudFormation
                                        .describeStacks({ StackName: StackName })
                                        .promise()];
                            case 1:
                                stackDetails = _a.sent();
                                if (stackDetails &&
                                    stackDetails.Stacks &&
                                    stackDetails.Stacks[0] &&
                                    stackDetails.Stacks[0].StackStatus) {
                                    stackOutput = stackDetails.Stacks[0];
                                    stackStatus = stackDetails.Stacks[0].StackStatus;
                                }
                                return [3 /*break*/, 3];
                            case 2:
                                err_4 = _a.sent();
                                console.log('Could not get stack:', err_4.message);
                                return [3 /*break*/, 3];
                            case 3:
                                if (!DEFAULTS.waitForStatuses.includes(stackStatus) && stackOutput) {
                                    replaceOutputs_1 = {};
                                    (_a = stackOutput.Outputs) === null || _a === void 0 ? void 0 : _a.map(function (obj) {
                                        if (obj.OutputKey) {
                                            replaceOutputs_1[obj.OutputKey] = obj.OutputValue;
                                        }
                                    });
                                    stackOutput.output = replaceOutputs_1;
                                    return [2 /*return*/, { value: stackOutput }];
                                }
                                console.log('Waiting for stack:', stackStatus);
                                return [4 /*yield*/, sleep(DEFAULTS.awsRetryWaitSeconds * 1000)];
                            case 4:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _b.label = 13;
            case 13:
                if (!(DEFAULTS.timeoutSeconds * 1000 > Date.now() - time)) return [3 /*break*/, 15];
                return [5 /*yield**/, _loop_1()];
            case 14:
                state_1 = _b.sent();
                if (typeof state_1 === "object")
                    return [2 /*return*/, state_1.value];
                return [3 /*break*/, 13];
            case 15:
                console.log('Timed out waiting for stack update.');
                return [2 /*return*/];
        }
    });
}); };
exports.upsertTemplate = upsertTemplate;
var route53ZoneUpdate = function (zoneID, zoneFilePath) { return new Promise(function (resolve, rejects) {
    var cli53 = child_process_1.spawn("cli53", ['import', '--file', "" + zoneFilePath, '--replace', "" + zoneID]);
    cli53.stdout.on('data', function (data) {
        console.log("stdout: " + data);
    });
    cli53.stderr.on('data', function (data) {
        console.error("stderr: " + data);
    });
    cli53.on('close', function (code) { return (code === 0) ? resolve(code) : rejects(code); });
}); };
exports.route53ZoneUpdate = route53ZoneUpdate;
var getCurrentAccountID = function () { return __awaiter(void 0, void 0, void 0, function () {
    var identity;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, sts.getCallerIdentity().promise()];
            case 1:
                identity = _a.sent();
                return [2 /*return*/, identity.Account];
        }
    });
}); };
exports.getCurrentAccountID = getCurrentAccountID;
