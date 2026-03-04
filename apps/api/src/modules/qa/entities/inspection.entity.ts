import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { User } from "../../auth/entities/user.entity";
import { WorkItem } from "../../roads/entities/work-item.entity";
import { ChecklistTemplate } from "./checklist-template.entity";

@Entity({ name: "inspections" })
export class Inspection {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index()
  @Column({ type: "uuid" })
  projectId!: string;

  @Index()
  @Column({ type: "uuid" })
  workItemId!: string;

  @Column({ type: "uuid", nullable: true })
  checklistTemplateId!: string | null;

  @Column({ type: "double precision", nullable: true })
  fromChainage!: number | null;

  @Column({ type: "double precision", nullable: true })
  toChainage!: number | null;

  @Column({ type: "text", default: "pass" })
  outcome!: "pass" | "conditional" | "fail";

  @Column({ type: "text", nullable: true })
  notes!: string | null;

  @Column({ type: "uuid" })
  inspectedByUserId!: string;

  @Column({ type: "timestamptz" })
  inspectedAt!: Date;

  @ManyToOne(() => WorkItem, { onDelete: "CASCADE" })
  workItem!: WorkItem;

  @ManyToOne(() => ChecklistTemplate, { onDelete: "SET NULL" })
  template!: ChecklistTemplate | null;

  @ManyToOne(() => User, { onDelete: "RESTRICT" })
  inspectedBy!: User;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}

