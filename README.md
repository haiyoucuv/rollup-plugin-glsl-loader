# rollup-plugin-glsl-loader

## Do what

import your shader file using ES modules, like this.

```javascript
import vert from './shader.vert';

console.log(vert);
```

## How to use

### Install

```shell
yarn add rollup-plugin-glsl-loader -D
```

or

```shell
npm i rollup-plugin-glsl-loader -D
```

### Use in Rollup config file

```javascript
const glslLoader = require("rollup-plugin-glsl-loader");
// or use ES modules
import glslLoader from "rollup-plugin-glsl-loader";

export default {
	[...
],
plugins: [
	glslLoader(),
]
}
;
```

## #include

You can use include directive.

### Example:

```glsl
// defaultAttribute.glsl
attribute vec3 pos;
```

```glsl
// vert.glsl
#include "defaultAttribute.glsl"

void main(){

    gl_Position = vec4(pos, 1.0);

}
```

equivalent to

```glsl
attribute vec3 pos;

void main(){

    gl_Position = vec4(pos, 1.0);

}
```

## glslify

process shader sources with [glslify](https://www.npmjs.com/package/glslify).

And install glslify in your devDependencies with

```shell
npm i glslify -D
```

```shell
yarn add glslify -D
```
