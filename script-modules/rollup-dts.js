import dts from "rollup-plugin-dts";
import getEntryFiles from "./util/entry-files";
import { chunkFileNames, typescriptDeclarationDir } from "./util/common";
import rimraf from "rimraf";

/** @type {import('rollup').PluginImpl} */
const cleanAfterBuild = (paths) => {
  if (!paths) throw new Error("paths must be specified");

  if (typeof paths === "string") paths = [paths];

  return {
    name: "clean-after-build",
    buildEnd() {
      return Promise.all(
        paths.map(
          (path) =>
            new Promise((resolve, reject) => {
              rimraf(path, (err) => {
                if (err) reject(err);
                else resolve();
              });
            }),
        ),
      );
    },
  };
};

const declarationDir = `dist/es/${typescriptDeclarationDir}/`;

export default {
  input: getEntryFiles((k, v) => [
    k,
    v.replace(/^src\//, declarationDir).replace(/.ts$/, ".d.ts"),
  ]),
  output: [
    {
      dir: "dist",
      format: "es",
      chunkFileNames: (info) => {
        const name = info.name.replace(/\.d$/, "");
        return chunkFileNames
          .replace(/\[name\]/g, name)
          .replace(/\.js$/, ".d.ts");
      },
    },
  ],
  plugins: [dts(), cleanAfterBuild(declarationDir)],
};
