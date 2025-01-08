import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import babel from '@rollup/plugin-babel';

export default {
    input: 'index.js', // 输入文件路径
    output: [
        {
            file: 'dist/cjs/bundle.cjs', // 输出为 CommonJS 模块
            format: 'cjs',
            sourcemap: true,
            inlineDynamicImports:true
        },
        {
            file: 'dist/esm/bundle.esm.js', // 输出为 ES 模块
            format: 'es',
            sourcemap: true,
            inlineDynamicImports:true
        }
    ],
    plugins: [
        resolve(), // 解析 node_modules 中的模块
        commonjs(), // 将 CommonJS 转换为 ES 模块
        babel({
            babelHelpers: 'bundled',
            exclude: 'node_modules/**' // 排除 node_modules 中的文件
        }),
        terser() // 压缩代码
    ]
};