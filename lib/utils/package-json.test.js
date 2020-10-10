"use strict";
exports.__esModule = true;
var package_json_1 = require("./package-json");
jest.setTimeout(2000);
describe("package-json", function () {
    it("Should return this projects package.json", function () {
        var result = package_json_1["default"]();
        expect(result.name).toBe("node-evaporate");
    });
});
