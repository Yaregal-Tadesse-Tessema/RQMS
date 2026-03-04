import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { User } from "../../auth/entities/user.entity";
import { Inspection } from "./inspection.entity";

@Entity({ name: "rework_records" })
export class ReworkRecord {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index()
  @Column({ type: "uuid" })
  inspectionId!: string;

  @Column({ type: "text", default: "open" })
  status!: "open" | "closed";

  @Column({ type: "text", nullable: true })
  note!: string | null;

  @Column({ type: "uuid" })
  createdByUserId!: string;

  @ManyToOne(() => Inspection, { onDelete: "CASCADE" })
  inspection!: Inspection;

  @ManyToOne(() => User, { onDelete: "RESTRICT" })
  createdBy!: User;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}

