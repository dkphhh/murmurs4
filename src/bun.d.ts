declare interface BunYAML {
  parse<T = any>(text: string): T;
}

declare var Bun: {
  YAML: BunYAML;
} & typeof import("bun");
