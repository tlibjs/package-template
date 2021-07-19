import externals from "rollup-plugin-node-externals";
import generatePackageJson from "rollup-plugin-generate-package-json";
import { compilePlugins } from "./rollup-common";
import { getPkgJsonBaseContents } from "./gen-pkg";
import getEntryFiles from "./util/entry-files";
import { chunkFileNames, typescriptDeclarationDir } from "./util/common";

export default {
  input: getEntryFiles(),
  output: [
    { dir: "dist", format: "cjs", sourcemap: true, chunkFileNames },
    { dir: "dist/es", format: "es", sourcemap: true, chunkFileNames },
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
