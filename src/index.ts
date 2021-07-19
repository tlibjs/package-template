import { pascalCase } from "pascal-case";

export function hello(name: string): string {
  return `hello ${name}!`;
}

export function helloPascalCase(name: string): string {
  return pascalCase(hello(name));
}

export { default as bye } from "./bye";
export { default as hi } from "./hi";
export { Punctuation } from "./util/format";
