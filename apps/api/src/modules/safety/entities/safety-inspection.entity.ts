import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { User } from "../../auth/entities/user.entity";

@Entity({ name: "safety_inspections" })
export class SafetyInspection {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index()
  @Column({ type: "uuid" })
  projectId!: string;

  @Column({ type: "date" })
  inspectionDate!: string;

  @Column({ type: "text", nullable: true })
  title!: string | null;

  @Column({ type: "text", nullable: true })
  notes!: string | null;

  @Column({ type: "uuid" })
  createdByUserId!: string;

  @ManyToOne(() => User, { onDelete: "RESTRICT" })
  createdBy!: User;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}

