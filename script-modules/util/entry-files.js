import glob from "glob";
import path from "path";

/**
 *
 * @param { (moduleName: string, fileRelativePath: string, index: number)=> [string, string] } formatter
 * @returns { Record<string, string> }
 */
export default function getEntryFiles(formatter) {
  let entries = [
    ...glob
      .sync("src/*.ts")
      .filter((f) => !/(\.(test|spec)\.ts$)|(\/__test__\/)/.test(f))
      .map((f) => [path.parse(f).name, f]),
    ...glob
      .sync("src/*/index.ts")
      .map((f) => [path.basename(path.dirname(f)), f]),
  ];

  if (formatter) {
    entries = entries.map((kv, i) => formatter(kv[0], kv[1], i));
  }

  const entryFiles = Object.fromEntries(entries);

  return entryFiles;
}
