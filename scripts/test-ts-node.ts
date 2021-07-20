const args = process.argv.slice(2);

console.log(
  `ts-node called successfully with ${
    args.length > 0
      ? `args:\n${args.map((arg) => `\t${arg}`).join("\n")}`
      : "no args."
  }`,
);
