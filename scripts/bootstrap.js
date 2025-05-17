const { existsSync, mkdirSync, writeFileSync, readdirSync, readFileSync } = require('fs');
const { join } = require('path');
const { yParser } = require('@umijs/utils');

(async () => {
  const args = yParser(process.argv);

  const packageRootPath = join(__dirname, '../package.json');
  const { name: projectName, version } = require(packageRootPath);
  
  const pkgs = readdirSync(join(__dirname, '../packages')).filter((pkg) => pkg.charAt(0) !== '.');
  pkgs.forEach((shortName) => {
    const name = `@${projectName}/${shortName}`;
    const pkgPath = join(__dirname, '..', 'packages', shortName);

    //package.json
    let json = {};
    const pkgJSONPath = join(pkgPath, 'package.json');
    const pkgJSONExists = existsSync(pkgJSONPath);
    if (args.force || !pkgJSONExists) {
      json = {
        name,
        version,
        description: name,
        main: 'lib/index.js',
        module: 'es/index.js',
        types: 'es/index.d.ts',
        files: ['dist', 'lib', 'es'],
        scripts: {
          build: 'father build',
        },
        repository: {
          type: 'git',
          url: `https://github.com/weidyg/${projectName}`,
        },
        browserslist: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 11'],
        keywords: [],
        authors: ['weidyg <weidyg@163.com> (https://github.com/weidyg)'],
        license: 'MIT',
        publishConfig: {
          access: 'public',
        },
        peerDependencies: {
          react: '>=18.0.0',
        },
      };
      writeFileSync(pkgJSONPath, `${JSON.stringify(json, null, 2)}\n`);
    } else if (pkgJSONExists) {
      const pkg = require(pkgJSONPath);
      [
        'dependencies',
        'devDependencies',
        'peerDependencies',
        'bin',
        'version',
        'files',
        'authors',
        'types',
        'sideEffects',
        'main',
        'module',
        'description',
      ].forEach((key) => {
        if (pkg[key]) {
          json[key] = pkg[key];
        }
      });
    }
    //README.md
    const readmePath = join(pkgPath, 'README.md');
    if (args.force || !existsSync(readmePath)) {
      const readmeText = `# ${name}

      > ${json.description}.
      
      ## Install
      
      Using npm:
      
      \`\`\`bash
      $ npm install --save ${name}
      \`\`\`
      
      or using yarn:
      
      \`\`\`bash
      $ yarn add ${name}
      \`\`\`
      `;
      writeFileSync(readmePath, readmeText);
    }
    //tsconfig.json
    const tsconfigPath = join(pkgPath, 'tsconfig.json');
    if (args.force || !existsSync(tsconfigPath)) {
      const tsconfigJson = {
        extends: '../../tsconfig.json',
        include: ['./src'],
      };
      writeFileSync(tsconfigPath, `${JSON.stringify(tsconfigJson, null, 2)}\n`);
    }
    //.fatherrc.ts
    const fatherrcPath = join(pkgPath, '.fatherrc.ts');
    if (args.force || !existsSync(fatherrcPath)) {
    // Convert package name to UMD name, e.g., @erp-rc/print -> erpRcPrint
    const umdName = name
      .replace(/^@/, '') // remove leading @
      .replace(/[-/](\w)/g, (_, c) => c.toUpperCase()); // convert -x or /x to X

      const fatherrcConfig = `import { defineConfig } from 'father';

export default defineConfig({
  extends: '../../.fatherrc.base.ts',
  umd: {
    name: '${umdName}',
    output: 'dist',
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      '^/antd/.*': 'antd',
      '^/dayjs/.*': 'dayjs',
    },
  },
});
 `;
      writeFileSync(fatherrcPath, fatherrcConfig);
    }
    //src/index.tsx
    const srcIndexPath = join(pkgPath, 'src', 'index.tsx');
    if (args.force || !existsSync(srcIndexPath)) {
      const srcDir = join(pkgPath, 'src');
      if (!existsSync(srcDir)) {
        mkdirSync(srcDir);
      }
      writeFileSync(srcIndexPath, `export { }; `);
      // writeFileSync(srcIndexPath, `export * from './components';`);
    }

    // const componentsIndexPath = join(pkgPath, 'src', 'components', 'index.tsx');
    // console.log(`${existsSync(componentsIndexPath)} ${componentsIndexPath}`);
    // if (!existsSync(componentsIndexPath)) {
    //   const srcDir = join(pkgPath, 'src', 'components');
    //   if (!existsSync(srcDir)) { mkdirSync(srcDir); }
    //   writeFileSync(srcIndexPath, `export { };`);
    // }
  });

  // const tsPathsKeys = Object.keys(tsPaths);
  // if (tsPathsKeys.length > 0) {
  //   const tsconfigRootPath = join(__dirname, '../tsconfig.json');
  //   if (existsSync(tsconfigRootPath)) {
  //     const file = readFileSync(tsconfigRootPath, 'utf-8');
  //     console.log('tfile', file);
  //     const tsconfig = JSON.parse(file);
  //     if (!tsconfig.compilerOptions) tsconfig.compilerOptions = {};
  //     if (!tsconfig.compilerOptions.paths) tsconfig.compilerOptions.paths = {};
  //     tsPathsKeys.forEach((name) => {
  //       tsconfig.compilerOptions.paths[name] = tsPaths[name];
  //     });
  //     writeFileSync(tsconfigRootPath, `${JSON.stringify(tsconfig, null, 2)}\n`);
  //   }
  // }
})();
