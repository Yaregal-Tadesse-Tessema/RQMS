/* eslint-disable no-console */
const fs = require("node:fs");
const path = require("node:path");
const { generateEndpoints, parseConfig } = require("@rtk-query/codegen-openapi");

async function main() {
  const openapiPath = path.resolve(__dirname, "../../api/openapi.json");
  const outputPath = path.resolve(__dirname, "../src/lib/api/generated.ts");

  const configs = parseConfig({
    schemaFile: openapiPath,
    apiFile: path.resolve(__dirname, "../src/lib/api/baseApi.ts"),
    apiImport: "baseApi",
    outputFile: outputPath,
    exportName: "rqmsApi",
    hooks: true
  });
  for (const cfg of configs) {
    await generateEndpoints(cfg);
  }

  // Normalize import path so generated file is portable across machines.
  const generated = fs.readFileSync(outputPath, "utf8");
  const normalized = generated.replace(
    /^import\s+\{\s*baseApi\s+as\s+api\s*\}\s+from\s+["'][^"']*baseApi["'];/m,
    'import { baseApi as api } from "@/lib/api/baseApi";'
  );
  fs.writeFileSync(outputPath, normalized, "utf8");

  console.log(`Generated RTK Query API to ${outputPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
