import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { ChainageSegment } from "./chainage-segment.entity";
import { Road } from "./road.entity";
import { RoadElement } from "./road-element.entity";
import { RoadFeature } from "./road-feature.entity";
import { WorkItem } from "./work-item.entity";

@Entity({ name: "road_sections" })
export class RoadSection {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  roadId!: string;

  @Column({ type: "text" })
  name!: string;

  @Column({ type: "double precision", nullable: true })
  startChainage!: number | null;

  @Column({ type: "double precision", nullable: true })
  endChainage!: number | null;

  @ManyToOne(() => Road, (r) => r.sections, { onDelete: "CASCADE" })
  road!: Road;

  @OneToMany(() => ChainageSegment, (s) => s.section)
  chainageSegments!: ChainageSegment[];

  @OneToMany(() => RoadElement, (e) => e.section)
  elements!: RoadElement[];

  @OneToMany(() => RoadFeature, (f) => f.section)
  features!: RoadFeature[];

  @OneToMany(() => WorkItem, (w) => w.section)
  workItems!: WorkItem[];

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}

