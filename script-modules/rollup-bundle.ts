import { compilePlugins } from "./rollup-common";
import { terser } from "rollup-plugin-terser";
import { pascalCase } from "pascal-case";
import * as pkg from "../package.json";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import type { ModuleFormat, OutputOptions, RollupOptions } from "rollup";

const GLOBAL_NAMESPACE = pascalCase(pkg.name);

const FORMATS: ModuleFormat[] = [
  //
  "es",
  "iife",
  "umd",
];

function genOutputs(format: ModuleFormat): OutputOptions[] {
  // https://rollupjs.org/guide/en/#outputname
  const name = format === "es" ? undefined : GLOBAL_NAMESPACE;

  return [true, false].map(
    (min): OutputOptions => ({
      format,
      sourcemap: true,
      file: `dist/bundle/${format}${min ? ".min" : ""}.js`,
      name,
      plugins: min ? [terser()] : undefined,
      exports: "auto",
    }),
  );
}

const bundleConfig: RollupOptions = {
  input: "src/index.ts",
  output: FORMATS.map(genOutputs).flat(1),
  plugins: [
    //
    ...compilePlugins(),
    nodeResolve(),
    commonjs(),
  ],
};

export default bundleConfig;
