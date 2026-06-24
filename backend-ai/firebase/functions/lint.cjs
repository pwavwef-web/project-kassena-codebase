const {execFileSync} = require("child_process");
const path = require("path");
const fs = require("fs");

const env = Object.assign({}, process.env, {ESLINT_USE_FLAT_CONFIG: "false"});

const eslintCmd = path.join("node_modules", ".bin", process.platform === "win32" ? "eslint.cmd" : "eslint");

try {
  execFileSync(eslintCmd, ["."], {
    stdio: "inherit",
    env: env,
  });
} catch (e) {
  process.exit(e.status || 1);
}
