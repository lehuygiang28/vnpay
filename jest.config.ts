process.env.TZ = 'UTC';

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    coverageThreshold: {
        global: {
            lines: 80,
        },
    },
};
