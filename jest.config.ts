process.env.TZ = 'UTC';

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        // match with .ts or .tsx files
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                tsconfig: 'tsconfig.test.json',
            },
        ],
    },
    coverageThreshold: {
        global: {
            lines: 80,
        },
    },
    reporters: [
        'default',
        [
            'jest-junit',
            {
                outputDirectory: './test-results',
                outputName: 'junit.xml',
                classNameTemplate: '{filepath}',
                titleTemplate: '{title}',
            },
        ],
    ],
};
