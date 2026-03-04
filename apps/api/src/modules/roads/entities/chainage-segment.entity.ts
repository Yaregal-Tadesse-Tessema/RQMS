import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { RoadSection } from "./road-section.entity";

@Entity({ name: "chainage_segments" })
export class ChainageSegment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  sectionId!: string;

  @Column({ type: "double precision" })
  fromChainage!: number;

  @Column({ type: "double precision" })
  toChainage!: number;

  @ManyToOne(() => RoadSection, (s) => s.chainageSegments, { onDelete: "CASCADE" })
  section!: RoadSection;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}

