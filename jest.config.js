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
}
