import { defineConfig } from 'father';

export default defineConfig({
  esm: {
    input: 'src',
    output: 'es',
    platform: 'browser',
    transformer: 'babel',
    ignores: ['src/**/_demos/*'],
    extraBabelPlugins: [
      [require.resolve('./scripts/replaceLib'), {}],
      ['transform-remove-console', { exclude: ['error', 'warn'] }],
    ],
  },
  cjs: {
    input: 'src',
    output: 'lib',
    platform: 'browser',
    transformer: 'babel',
    ignores: ['src/**/_demos/*'],
    extraBabelPlugins: [
      [require.resolve('./scripts/replaceEs'), {}],
      ['transform-remove-console', { exclude: ['error', 'warn'] }],
    ],
  },
});
