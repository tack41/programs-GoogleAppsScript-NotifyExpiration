module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globals: {
    Logger: {},
    DocumentApp: {} // <- 追加
  }
};