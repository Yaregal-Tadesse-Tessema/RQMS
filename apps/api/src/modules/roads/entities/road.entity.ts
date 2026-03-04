import { Column, CreateDateColumn, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { Project } from "./project.entity";
import { RoadSection } from "./road-section.entity";

@Entity({ name: "roads" })
@Index(["projectId", "code"], { unique: true })
export class Road {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  projectId!: string;

  @Column({ type: "text" })
  name!: string;

  @Column({ type: "text" })
  code!: string;

  @Column({ type: "text", nullable: true })
  roadType!: string | null; // highway, city, etc. (free text for now)

  @ManyToOne(() => Project, (p) => p.roads, { onDelete: "CASCADE" })
  project!: Project;

  @OneToMany(() => RoadSection, (s) => s.road)
  sections!: RoadSection[];

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}

