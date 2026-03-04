import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "./entities/user.entity";

type UpsertFromAuthInput = {
  authProvider: string;
  authUserId: string;
  email: string | null;
  displayName: string | null;
};

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  async upsertFromAuth(input: UpsertFromAuthInput): Promise<User> {
    const existing = await this.repo.findOne({
      where: { authProvider: input.authProvider, authUserId: input.authUserId }
    });

    if (existing) {
      const next = this.repo.merge(existing, {
        email: input.email ?? existing.email,
        displayName: input.displayName ?? existing.displayName
      });
      return await this.repo.save(next);
    }

    const created = this.repo.create({
      authProvider: input.authProvider,
      authUserId: input.authUserId,
      email: input.email,
      displayName: input.displayName,
      isActive: true
    });
    return await this.repo.save(created);
  }
}

