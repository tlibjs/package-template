import typescript from "@rollup/plugin-typescript";
import babel from "@rollup/plugin-babel";

export function compilePlugins(options) {
  return [
    // https://github.com/rollup/plugins/tree/master/packages/typescript
    typescript({
      tsconfig: "tsconfig.prod.json",
      sourceMap: true,
      inlineSources: true,
      ...(options || {}).typescript,
    }),
    // https://github.com/rollup/plugins/tree/master/packages/babel
    babel({
      extensions: [".js", ".jsx", ".es6", ".es", ".mjs", ".ts", ".tsx"],
      babelHelpers: "bundled",
      exclude: /node_modules/,
      ...(options || {}).babel,
    }),
  ];
}
