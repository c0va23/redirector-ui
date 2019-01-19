module.exports = {
  roots: [
    "<rootDir>/src",
    "<rootDir>/specs",
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "specs/.*\\.spec\\.tsx?$",
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
  ],
  setupTestFrameworkScriptFile: '<rootDir>/specs/setup.ts',
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.(ts|tsx)",
    "!src/index.tsx",
  ],
}
