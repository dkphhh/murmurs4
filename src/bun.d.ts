declare interface BunYAML {
  parse<T = unknown>(text: string): T;
}

declare const Bun: {
  YAML: BunYAML;
} & typeof import("bun");
