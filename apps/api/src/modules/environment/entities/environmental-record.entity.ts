import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { User } from "../../auth/entities/user.entity";

@Entity({ name: "environmental_records" })
export class EnvironmentalRecord {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index()
  @Column({ type: "uuid" })
  projectId!: string;

  @Column({ type: "timestamptz" })
  capturedAt!: Date;

  @Column({ type: "text" })
  parameter!: string; // dust, noise, waste, water, etc.

  @Column({ type: "double precision", nullable: true })
  value!: number | null;

  @Column({ type: "text", nullable: true })
  unit!: string | null;

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

