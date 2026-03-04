import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { RoadElement } from "./road-element.entity";
import { RoadFeature } from "./road-feature.entity";
import { RoadSection } from "./road-section.entity";

@Entity({ name: "work_items" })
export class WorkItem {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  sectionId!: string;

  @Column({ type: "uuid", nullable: true })
  roadElementId!: string | null;

  @Column({ type: "uuid", nullable: true })
  roadFeatureId!: string | null;

  @Column({ type: "uuid", nullable: true })
  workLayerId!: string | null;

  @Column({ type: "uuid", nullable: true })
  activityTypeId!: string | null;

  @Column({ type: "text" })
  name!: string;

  @Column({ type: "text" })
  unit!: string; // m, m2, m3, ton, item, etc.

  @ManyToOne(() => RoadSection, (s) => s.workItems, { onDelete: "CASCADE" })
  section!: RoadSection;

  @ManyToOne(() => RoadElement, { onDelete: "SET NULL" })
  roadElement!: RoadElement | null;

  @ManyToOne(() => RoadFeature, { onDelete: "SET NULL" })
  roadFeature!: RoadFeature | null;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}

