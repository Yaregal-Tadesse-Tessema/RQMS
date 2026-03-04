import "reflect-metadata";

import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { AppModule } from "./modules/app/app.module";

async function generateOpenApi() {
  // eslint-disable-next-line no-console
  console.log(`OpenAPI generation starting. DATABASE_URL set: ${Boolean(process.env.DATABASE_URL)}`);
  const app = await NestFactory.create(AppModule, { logger: ["error", "warn", "log"] });

  const swaggerConfig = new DocumentBuilder()
    .setTitle("RQMS API")
    .setDescription("Operations & Field Execution API (v1)")
    .setVersion("0.1.0")
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  // Write next to the workspace (apps/api) regardless of where the script is launched from.
  const outPath = resolve(__dirname, "..", "openapi.json");
  writeFileSync(outPath, JSON.stringify(swaggerDocument, null, 2), "utf-8");

  await app.close();
  // eslint-disable-next-line no-console
  console.log(`Wrote OpenAPI to ${outPath}`);
}

generateOpenApi().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
