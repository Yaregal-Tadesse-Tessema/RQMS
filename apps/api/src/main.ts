import "reflect-metadata";

import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";

import { AppModule } from "./modules/app/app.module";

async function bootstrap() {
  const logger = new Logger("Bootstrap");
  const app = await NestFactory.create(AppModule, { cors: true });
  const config = app.get(ConfigService);
  app.setGlobalPrefix("api");

  app.use(
    helmet({
      contentSecurityPolicy: false
    })
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle("RQMS API")
    .setDescription("Operations & Field Execution API (v1)")
    .setVersion("0.1.0")
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api/docs", app, swaggerDocument);

  const port = Number(config.get("API_PORT") ?? 4000);
  await app.listen(port);

  const appUrl = await app.getUrl();
  logger.log(`RQMS API is running on ${appUrl}`);
  logger.log(`Port: ${port}`);
  logger.log(`API prefix: ${appUrl}/api`);
  logger.log(`Swagger docs: ${appUrl}/api/docs`);
}

bootstrap();
