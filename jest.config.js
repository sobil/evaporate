module.exports = {
  projects: [{
    roots: ["<rootDir>/src"],
    preset: "ts-jest",
    testEnvironment: "node",
    testTimeout: 2000,
    displayName: "test"
  }, {
    roots: ["<rootDir>/src"],
    preset: "ts-jest",
    testEnvironment: "node",
    displayName: "lint",
    runner: "jest-runner-eslint",
    testMatch: ["<rootDir>/src/**/*.ts"]

  }]
};
