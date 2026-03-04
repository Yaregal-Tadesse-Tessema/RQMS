import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { User } from "./entities/user.entity";
import { AuthController } from "./http/auth.controller";
import { JwtJwksAuthGuard } from "./http/jwt-jwks-auth.guard";
import { JwksJwtVerifier } from "./jwks/jwks-jwt-verifier";
import { UsersService } from "./users.service";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [JwksJwtVerifier, UsersService, JwtJwksAuthGuard],
  exports: [JwksJwtVerifier, UsersService, JwtJwksAuthGuard]
})
export class AuthModule {}
