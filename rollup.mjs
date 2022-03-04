/*
 * rollup.mjs
 * Created by 还有醋v on 2022/3/4.
 * Copyright © 2021 haiyoucuv. All rights reserved.
 */

import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";
import progress from "rollup-plugin-progress";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";

export default {
	input: "src/index.ts",
	cache: true,
	output: [
		{
			file: "dist/index.js",
			format: "cjs",
		},
		{
			file: 'dist/index.module.js',
			format: 'esm',
		}
	],
	plugins: [
		progress(),
		typescript({ tsconfig: "./tsconfig.json" }),
		json(),
		resolve(),
		commonjs({
			include: 'node_modules/**',
		}),
		// terser(),
	]
};
