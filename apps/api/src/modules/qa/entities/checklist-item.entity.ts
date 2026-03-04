import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { ChecklistTemplate } from "./checklist-template.entity";

@Entity({ name: "checklist_items" })
export class ChecklistItem {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index()
  @Column({ type: "uuid" })
  templateId!: string;

  @Column({ type: "text" })
  text!: string;

  @ManyToOne(() => ChecklistTemplate, (t) => t.items, { onDelete: "CASCADE" })
  template!: ChecklistTemplate;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;
}

