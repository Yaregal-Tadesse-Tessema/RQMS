import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { ProjectMembership } from "./project-membership.entity";
import { Road } from "./road.entity";

export type ProjectType = "ROAD" | "BRIDGE" | "DRAINAGE" | "OTHER";

@Entity({ name: "projects" })
export class Project {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "text" })
  name!: string;

  @Column({ type: "text", default: "ROAD" })
  projectType!: ProjectType;

  @OneToMany(() => Road, (r) => r.project)
  roads!: Road[];

  @OneToMany(() => ProjectMembership, (m) => m.project)
  memberships!: ProjectMembership[];

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}

