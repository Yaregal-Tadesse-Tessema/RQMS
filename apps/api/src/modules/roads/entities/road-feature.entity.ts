import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { RoadSection } from "./road-section.entity";

@Entity({ name: "road_features" })
export class RoadFeature {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  sectionId!: string;

  @Column({ type: "text" })
  featureType!: string; // inlet, sign, crossing, pole, etc.

  @Column({ type: "double precision", nullable: true })
  chainage!: number | null;

  @Column({ type: "double precision", nullable: true })
  lat!: number | null;

  @Column({ type: "double precision", nullable: true })
  lng!: number | null;

  @ManyToOne(() => RoadSection, (s) => s.features, { onDelete: "CASCADE" })
  section!: RoadSection;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}

