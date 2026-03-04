import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { User } from "../../auth/entities/user.entity";
import { WorkItem } from "./work-item.entity";

@Entity({ name: "daily_progress" })
export class DailyProgress {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  workItemId!: string;

  @Column({ type: "date" })
  workDate!: string; // yyyy-mm-dd

  @Column({ type: "double precision" })
  quantity!: number;

  @Column({ type: "double precision", nullable: true })
  fromChainage!: number | null;

  @Column({ type: "double precision", nullable: true })
  toChainage!: number | null;

  @Column({ type: "double precision", nullable: true })
  lat!: number | null;

  @Column({ type: "double precision", nullable: true })
  lng!: number | null;

  @Column({ type: "jsonb", nullable: true })
  weather!: Record<string, unknown> | null;

  @Column({ type: "text", nullable: true })
  notes!: string | null;

  @Column({ type: "uuid" })
  createdByUserId!: string;

  @ManyToOne(() => WorkItem, { onDelete: "CASCADE" })
  workItem!: WorkItem;

  @ManyToOne(() => User, { onDelete: "RESTRICT" })
  createdBy!: User;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}

