import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { User } from "../../auth/entities/user.entity";

@Entity({ name: "incidents" })
export class Incident {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index()
  @Column({ type: "uuid" })
  projectId!: string;

  @Column({ type: "timestamptz" })
  occurredAt!: Date;

  @Column({ type: "text", default: "medium" })
  severity!: "low" | "medium" | "high";

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "double precision", nullable: true })
  lat!: number | null;

  @Column({ type: "double precision", nullable: true })
  lng!: number | null;

  @Column({ type: "uuid" })
  createdByUserId!: string;

  @ManyToOne(() => User, { onDelete: "RESTRICT" })
  createdBy!: User;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}

