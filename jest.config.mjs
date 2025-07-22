import { pathsToModuleNameMapper } from 'ts-jest'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const { compilerOptions } = require('./tsconfig.json')

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  roots: ['./src'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testRegex: '(\\.|/)(test|spec)\\.ts?$',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
}
