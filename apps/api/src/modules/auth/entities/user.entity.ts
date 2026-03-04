import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "text", default: "better-auth" })
  authProvider!: string;

  @Index()
  @Column({ type: "text" })
  authUserId!: string; // JWT sub

  @Column({ type: "text", nullable: true })
  email!: string | null;

  @Column({ type: "text", nullable: true })
  displayName!: string | null;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}

