function trimDist(p: string): string {
  if (!p.startsWith("dist/")) {
    throw new Error("Path should starts with 'dist/'.");
  }
  return p.slice(5);
}

/**
 *
 * @see https://github.com/vladshcherbin/rollup-plugin-generate-package-json#basecontents
 * @param pkg input package.json content
 */
export function getPkgJsonBaseContents(
  pkg: Record<string, unknown>,
): Record<string, unknown> {
  const reserved = [
    "name",
    "version",
    "description",
    "license",
    "keywords",
    "author",
    "repository",
    "publishConfig",
  ];
  const pkgEntries = ["main", "module", "types"];

  const contents: Record<string, unknown> = {};

  for (const e of reserved) {
    contents[e] = pkg[e];
  }

  for (const e of pkgEntries) {
    const value = pkg[e];
    if (value === undefined) continue;

    if (typeof value !== "string") {
      throw new Error(
        `package.json "${e}" field must be a string if specified, but received ${String(
          value,
        )}`,
      );
    }
    contents[e] = trimDist(value);
  }

  contents.exports = {
    ".": "./es/index.js",
    "./*": "./es/*.js",
  };

  return contents;
}
