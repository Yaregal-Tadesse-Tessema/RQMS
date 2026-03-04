import { Injectable, UnauthorizedException } from "@nestjs/common";
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";

type Verified = {
  payload: JWTPayload;
  protectedHeader: { [k: string]: unknown };
};

@Injectable()
export class JwksJwtVerifier {
  private readonly jwksUrl: URL;
  private readonly jwks: ReturnType<typeof createRemoteJWKSet>;

  constructor() {
    const url = "http://localhost:5000/api/auth/jwks";
    this.jwksUrl = new URL(url);
    this.jwks = createRemoteJWKSet(this.jwksUrl);
  }

  async verify(token: string): Promise<Verified> {
    try {
      const { payload, protectedHeader } = await jwtVerify(token, this.jwks, {
        // issuer/audience are optional to keep local dev simple; set env vars when ready.
        issuer: process.env.AUTH_ISSUER || undefined,
        audience: process.env.AUTH_AUDIENCE || undefined
      });
      return { payload, protectedHeader };
    } catch (err) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
