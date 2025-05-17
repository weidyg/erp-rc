import { defineConfig } from 'father';

export default defineConfig({
  extends: '../../.fatherrc.base.ts',
  umd: {
    name: 'erpRc',
    output: 'dist',
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      '^/antd/.*': 'antd',
      '^/dayjs/.*': 'dayjs',
    },
  },
});
