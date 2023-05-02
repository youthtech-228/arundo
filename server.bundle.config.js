import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default {
  input: 'src/server.ts',
  output: {
    dir: 'dist',
    format: 'cjs',
  },
  plugins: [nodeResolve(), commonjs(), json()],
};
