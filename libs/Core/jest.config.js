const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('./tsconfig')
module.exports = {
    preset: 'ts-jest',
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: `<rootDir>${compilerOptions.baseUrl}`}),
    modulePaths: [
        '<rootDir>'
    ]
}