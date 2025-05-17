import { defineConfig } from 'father';

export default defineConfig({
  extends: '../../.fatherrc.base.ts',
  umd: {
    name: 'erpRcPrint',
    output: 'dist',
    platform: 'browser',
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      '^/antd/.*': 'antd',
      '^/dayjs/.*': 'dayjs',
    },
     extraBabelPlugins: [
        ["transform-remove-console", { "exclude": ["error", "warn"] }]
    ]
  },
});
