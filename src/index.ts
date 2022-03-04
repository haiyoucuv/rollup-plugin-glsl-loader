/*
 * index.ts
 * Created by 还有醋v on 2022/3/4.
 * Copyright © 2022 haiyoucuv. All rights reserved.
 */

import * as fs from "fs";
import * as path from "path";

import {version, name} from "../package.json"

export default function glslLoader(options) {

	let glslifyCompile = null;

	const glslifyInit = async () => {
		if (glslifyCompile) return;
		try {
			// @ts-ignore
			const glslify = await import('glslify');
			if (glslify && glslify.compile && typeof glslify.compile === 'function') {
				glslifyCompile = glslify.compile;
			}
		} catch {
			// do nothing
		}
	}

	const glslifyLoadSource = async (id, source, options, failError, warnLog = console.error) => {
		if (!glslifyCompile) {
			failError(`glslify could not be found. Install it with npm i -D glslify`);
		}

		let basedir = path.dirname(id);
		if (!fs.existsSync(basedir)) {
			warnLog(`Error resolving path: '${id}' : glslify may fail to find includes`);
			basedir = process.cwd();
		}

		return glslifyCompile(source, ({ basedir, ...options }));
	}

	const includeRegExp = /#include (["^+"]?["\ "[a-zA-Z_0-9](.*)"]*?)/g;

	// loader
	const loadSource = (id, onerror) => {
		// 如果没有
		if (!fs.existsSync(id)) {
			onerror({ message: `\n${id} is not found! Please make sure it exists` });
		}

		let source = fs.readFileSync(id, { encoding: 'utf8' });
		return source.replace(includeRegExp, (_, strMatch) => {
			const includeOpt = strMatch.split(' ');
			const includeName = includeOpt[0].replace(/"/g, '');
			const includePath = path.resolve(id, "..", includeName);

			// 递归检查 #include
			return loadSource(includePath, onerror);
		});
	}

	return {
		name,
		version,

		async options(options) {
			await glslifyInit();
		},

		async load(id) {
			if (/\.(glsl|vs|fs|vert|frag)$/.test(id)) {
				let source = loadSource(id, this.error.bind(this));

				// 载入 glslify
				try {
					source = await glslifyLoadSource(id, source, {},
						(message) => this.error({ message }));
				} catch (err) {
					this.error({ message: `Error load GLSL source with glslify:\n${err.message}` });
				}

				// 导出es模块
				return `export default ${JSON.stringify(source)}`;
			}
		},
	}

}
