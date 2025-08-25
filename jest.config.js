export default {
    testEnvironment: "jsdom",
    transform: {
      "^.+\\.(t|j)sx?$": ["ts-jest", { tsconfig: "tsconfig.json", useESM: true }],
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
    setupFilesAfterEnv: ["<rootDir>/jest.setup.mjs"],
  };
  