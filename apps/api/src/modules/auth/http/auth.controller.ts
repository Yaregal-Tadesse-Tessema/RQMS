import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import type { Request } from "express";

import { CurrentUser } from "../http/current-user.decorator";
import { JwtJwksAuthGuard } from "../http/jwt-jwks-auth.guard";
import { User } from "../entities/user.entity";

@ApiTags("auth")
@Controller("/auth")
export class AuthController {
  @ApiBearerAuth()
  @UseGuards(JwtJwksAuthGuard)
  @Get("/me")
  @ApiOkResponse({
    description: "Returns the authenticated user (mapped from Better Auth JWT)."
  })
  me(@CurrentUser() user: User, @Req() req: Request) {
    return {
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        authUserId: user.authUserId
      },
      token: (req as any).authToken ?? null
    };
  }
}

