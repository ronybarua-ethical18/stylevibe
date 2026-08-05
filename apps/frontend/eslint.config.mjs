import { config } from "@repo/eslint-config/next";

export default [
  ...config,
  // CommonJS build-tool configs; the ESM parser flags `module` as undefined
  { ignores: ["postcss.config.js", "tailwind.config.js"] },
];
