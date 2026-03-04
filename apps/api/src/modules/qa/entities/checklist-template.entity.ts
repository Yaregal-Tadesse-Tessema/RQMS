import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { ChecklistItem } from "./checklist-item.entity";

@Entity({ name: "checklist_templates" })
export class ChecklistTemplate {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index()
  @Column({ type: "uuid" })
  projectId!: string;

  @Column({ type: "text" })
  name!: string;

  @OneToMany(() => ChecklistItem, (i) => i.template)
  items!: ChecklistItem[];

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}

