export default {
  transformIgnorePatterns: ["node_modules/(?!(sucrase)/)"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx|mjs)$": "babel-jest",
  },
  testEnvironment: "node",
  moduleNameMapper: {},
};
