import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";

import { JwksJwtVerifier } from "../jwks/jwks-jwt-verifier";
import { UsersService } from "../users.service";

@Injectable()
export class JwtJwksAuthGuard implements CanActivate {
  constructor(
    private readonly verifier: JwksJwtVerifier,
    private readonly users: UsersService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const auth = req.headers.authorization;

    if (!auth || !auth.toLowerCase().startsWith("bearer ")) {
      throw new UnauthorizedException("Missing Bearer token");
    }

    const token = auth.slice("bearer ".length).trim();
    const { payload } = await this.verifier.verify(token);

    const sub = payload.sub;
    if (!sub) {
      throw new UnauthorizedException("Token missing sub");
    }

    const email = typeof payload.email === "string" ? payload.email : null;
    const name = typeof payload.name === "string" ? payload.name : null;

    const user = await this.users.upsertFromAuth({
      authProvider: "better-auth",
      authUserId: sub,
      email,
      displayName: name
    });

    (req as any).user = user;
    (req as any).authToken = { sub, email, name };
    return true;
  }
}

