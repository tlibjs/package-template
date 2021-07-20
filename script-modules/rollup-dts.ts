import dts from "rollup-plugin-dts";
import getEntryFiles from "./util/entry-files";
import { chunkFileNames, typescriptDeclarationDir } from "./util/common";
import rimraf from "rimraf";
import type { PluginImpl, RollupOptions } from "rollup";

function isStringOrStringArray(value: unknown): value is string | string[] {
  return (
    typeof value === "string" ||
    (Array.isArray(value) && value.every((v) => typeof v === "string"))
  );
}

const cleanAfterBuild: PluginImpl<{ paths?: string | string[] }> = ({
  paths,
} = {}) => {
  if (!paths) throw new Error("paths must be specified");

  if (!isStringOrStringArray(paths))
    throw new Error("paths must be a string or array of strings");

  const pathList = typeof paths === "string" ? [paths] : paths;

  return {
    name: "clean-after-build",
    buildEnd() {
      return Promise.all(
        pathList.map(
          (path) =>
            new Promise<void>((resolve, reject) => {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call
              rimraf(path, (err) => {
                if (err) reject(err);
                else resolve();
              });
            }),
        ),
      ).then(() => undefined);
    },
  };
};

const declarationDir = `dist/es/${typescriptDeclarationDir}/`;

const dtsConfig: RollupOptions = {
  input: getEntryFiles((k, v) => [
    k,
    v.replace(/^src\//, declarationDir).replace(/.ts$/, ".d.ts"),
  ]),
  output: [
    {
      dir: "dist",
      format: "es",
      // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
      chunkFileNames: (info) => {
        const name = info.name.replace(/\.d$/, "");
        return chunkFileNames
          .replace(/\[name\]/g, name)
          .replace(/\.js$/, ".d.ts");
      },
    },
  ],
  plugins: [dts(), cleanAfterBuild({ paths: declarationDir })],
};

export default dtsConfig;
