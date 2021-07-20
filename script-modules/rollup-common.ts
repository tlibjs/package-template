import typescript, { RollupTypescriptOptions } from "@rollup/plugin-typescript";
import babel, { RollupBabelInputPluginOptions } from "@rollup/plugin-babel";
import type { Plugin } from "rollup";

export interface CompilePluginsOptions {
  typescript?: Partial<RollupTypescriptOptions>;
  babel?: Partial<RollupBabelInputPluginOptions>;
}

export function compilePlugins(options: CompilePluginsOptions = {}): Plugin[] {
  return [
    // https://github.com/rollup/plugins/tree/master/packages/typescript
    typescript({
      tsconfig: "tsconfig.json",
      sourceMap: true,
      inlineSources: true,
      include: "src/**/*.ts",
      exclude: ["**/*.spec.ts", "**/*.test.ts", "**/__test__/**/*.spec.ts"],
      ...options.typescript,
    }),
    // https://github.com/rollup/plugins/tree/master/packages/babel
    babel({
      extensions: [".js", ".jsx", ".es6", ".es", ".mjs", ".ts", ".tsx"],
      babelHelpers: "bundled",
      exclude: /node_modules/,
      ...options.babel,
    }),
  ];
}
