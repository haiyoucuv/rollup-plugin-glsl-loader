'use strict';

var fs = require('fs');
var path = require('path');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var fs__namespace = /*#__PURE__*/_interopNamespace(fs);
var path__namespace = /*#__PURE__*/_interopNamespace(path);

var name = "rollup-plugin-glsl-loader";
var version = "1.0.4";

/*
 * index.ts
 * Created by 还有醋v on 2022/3/4.
 * Copyright © 2022 haiyoucuv. All rights reserved.
 */
function glslLoader(options) {
    let glslifyCompile = null;
    const glslifyInit = async () => {
        if (glslifyCompile)
            return;
        try {
            // @ts-ignore
            const glslify = await Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespace(require('glslify')); });
            if (glslify && glslify.compile && typeof glslify.compile === 'function') {
                glslifyCompile = glslify.compile;
            }
        }
        catch {
            // do nothing
        }
    };
    const glslifyLoadSource = async (id, source, options, failError, warnLog = console.error) => {
        if (!glslifyCompile) {
            failError(`glslify could not be found. Install it with npm i -D glslify`);
        }
        let basedir = path__namespace.dirname(id);
        if (!fs__namespace.existsSync(basedir)) {
            warnLog(`Error resolving path: '${id}' : glslify may fail to find includes`);
            basedir = process.cwd();
        }
        return glslifyCompile(source, ({ basedir, ...options }));
    };
    const includeRegExp = /#include (["^+"]?["\ "[a-zA-Z_0-9](.*)"]*?)/g;
    // loader
    const loadSource = (id, onerror) => {
        // 如果没有
        if (!fs__namespace.existsSync(id)) {
            onerror({ message: `\n${id} is not found! Please make sure it exists` });
        }
        let source = fs__namespace.readFileSync(id, { encoding: 'utf8' });
        return source.replace(includeRegExp, (_, strMatch) => {
            const includeOpt = strMatch.split(' ');
            const includeName = includeOpt[0].replace(/"/g, '');
            const includePath = path__namespace.resolve(id, "..", includeName);
            // 递归检查 #include
            return loadSource(includePath, onerror);
        });
    };
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
                    source = await glslifyLoadSource(id, source, {}, (message) => this.error({ message }));
                }
                catch (err) {
                    this.error({ message: `Error load GLSL source with glslify:\n${err.message}` });
                }
                // 导出es模块
                return `export default ${JSON.stringify(source)}`;
            }
        },
    };
}

module.exports = glslLoader;
