import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'
import builtins from 'rollup-plugin-node-builtins'
import globals from 'rollup-plugin-node-globals'

import { terser } from 'rollup-plugin-terser'

export default [
    {
        input: 'src/d2.js',
        plugins: [
            globals(),
            builtins(),
            babel({
                exclude: 'node_modules/**'
            }),
            json(),
            resolve(),
            commonjs(),
            terser(),
        ],
        output: {
            file: 'build/umd/d2.js',
            format: 'umd',
            name: 'd2',
            esModule: false,
        },
    },
    {
        input: {
            index: 'src/d2.js',
        },
        plugins: [
            resolve(),
            babel({
                exclude: 'node_modules/**'
            }),
        ],
        output: [
            {
                dir: 'build/esm',
                format: 'esm',
            },
            {
                dir: 'build/cjs',
                format: 'cjs',
            },
        ],
        external: [
            'isomorphic-fetch',
            'lodash.sortBy',
        ]
    }
]
