const dts = require("rollup-plugin-dts").default;
const typescript = require("@rollup/plugin-typescript");
const noderesolve = require("@rollup/plugin-node-resolve").default;
const commonjs = require("@rollup/plugin-commonjs").default;
const pkg = require("./package.json");
module.exports.default = [
  {
    input: "src/index.ts",
    external: Object.keys(pkg.dependencies),
    output: {
      file: "dist/index.d.ts",
      format: "es",
    },
    plugins: [dts()],
  },
  {
    input: "src/index.ts",
    external: Object.keys(pkg.dependencies),
    output: {
      file: "dist/index.js",
      format: "cjs",
      esModule: true,
      exports: "named",
    },
    plugins: [typescript(), noderesolve(), commonjs()],
  },
];
