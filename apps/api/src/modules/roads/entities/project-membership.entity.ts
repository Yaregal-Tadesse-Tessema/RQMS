import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { User } from "../../auth/entities/user.entity";
import { Project } from "./project.entity";

@Entity({ name: "project_memberships" })
@Index(["projectId", "userId"], { unique: true })
export class ProjectMembership {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  projectId!: string;

  @Column({ type: "uuid" })
  userId!: string;

  @Column({ type: "text", default: "member" })
  role!: string;

  @ManyToOne(() => Project, (p) => p.memberships, { onDelete: "CASCADE" })
  project!: Project;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user!: User;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}

