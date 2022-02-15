const { resolve } = require('path');

const esbuild = require('esbuild');

const main = async () => {
  const devServer = await esbuild.serve(
    {
      servedir: '.',
      port: 8000,
    },
    {
      stdin: {
        contents: "import { Yanvas } from './yanvas'; module.exports = Yanvas;",
        resolveDir: resolve(__dirname, '../src'),
        sourcefile: 'index.bundle.ts',
        loader: 'ts',
      },
      platform: 'browser',
      target: ['es2020'],
      format: 'iife',
      bundle: true,
      globalName: 'Yanvas',
      outfile: 'dist/yanvas.development.bundle.js',
      sourcemap: true,
    }
  );

  console.log(`Listening at http://localhost:${devServer.port}`);
};

main();
