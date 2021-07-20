import * as glob from "glob";
import * as path from "path";

export type EntryFileFormatter = (
  moduleName: string,
  fileRelativePath: string,
  index: number,
) => [string, string];

export default function getEntryFiles(
  formatter?: EntryFileFormatter,
): Record<string, string> {
  let entries: (readonly [string, string])[] = [
    ...glob
      .sync("src/*.ts")
      .filter((f) => !/(\.(test|spec)\.ts$)|(\/__test__\/)/.test(f))
      .map((f) => [path.parse(f).name, f] as const),
    ...glob
      .sync("src/*/index.ts")
      .map((f) => [path.basename(path.dirname(f)), f] as const),
  ];

  if (formatter) {
    entries = entries.map((kv, i) => formatter(kv[0], kv[1], i));
  }

  const entryFiles = Object.fromEntries(entries);

  return entryFiles;
}
