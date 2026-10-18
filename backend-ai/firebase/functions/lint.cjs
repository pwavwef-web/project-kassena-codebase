const {execFileSync} = require("child_process");
const path = require("path");

const env = Object.assign({}, process.env, {ESLINT_USE_FLAT_CONFIG: "false"});

const eslintBin = path.join("node_modules", "eslint", "bin", "eslint.js");

try {
  execFileSync(process.execPath, [eslintBin, "."], {
    stdio: "inherit",
    env: env,
  });
} catch (e) {
  process.exit(e.status || 1);
}
