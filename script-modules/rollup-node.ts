import externals from "rollup-plugin-node-externals";
import generatePackageJson from "rollup-plugin-generate-package-json";
import { compilePlugins } from "./rollup-common";
import { getPkgJsonBaseContents } from "./gen-pkg";
import getEntryFiles from "./util/entry-files";
import { chunkFileNames, typescriptDeclarationDir } from "./util/common";
import type { OutputOptions, RollupOptions } from "rollup";

const commonOutputOptions: Partial<OutputOptions> = {
  exports: "auto",
  sourcemap: true,
  chunkFileNames,
};

const nodeConfig: RollupOptions = {
  input: getEntryFiles(),
  output: [
    { ...commonOutputOptions, dir: "dist", format: "cjs" },
    { ...commonOutputOptions, dir: "dist/es", format: "es" },
  ],
  plugins: [
    // https://github.com/Septh/rollup-plugin-node-externals
    externals({
      builtins: true,
      deps: true,
      peerDeps: true,
      optDeps: true,
      devDeps: false,
    }),
    ...compilePlugins({
      typescript: {
        declaration: true,
        declarationDir: "dist/es/" + typescriptDeclarationDir,
      },
    }),
    // https://github.com/vladshcherbin/rollup-plugin-generate-package-json
    generatePackageJson({
      baseContents: getPkgJsonBaseContents,
      outputFolder: "dist",
    }),
  ],
};

export default nodeConfig;
