module.exports = {
    env: {
        node: 1,
    },
    globals: {
        "ts-jest": {
            tsconfig: "tsconfig.json",
        },
    },
    moduleFileExtensions: [
        "ts",
        "js",
    ],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
    },
    testMatch: [
        "**/test/**/*.spec.ts",
    ],
    testEnvironment: "node",
};
