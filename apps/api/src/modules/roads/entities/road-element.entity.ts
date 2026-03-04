import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { RoadSection } from "./road-section.entity";

@Entity({ name: "road_elements" })
export class RoadElement {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  sectionId!: string;

  @Column({ type: "text" })
  elementType!: string; // sidewalk, bike lane, drainage, etc.

  @Column({ type: "double precision", nullable: true })
  fromChainage!: number | null;

  @Column({ type: "double precision", nullable: true })
  toChainage!: number | null;

  @ManyToOne(() => RoadSection, (s) => s.elements, { onDelete: "CASCADE" })
  section!: RoadSection;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}

