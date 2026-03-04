import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { User } from "../../auth/entities/user.entity";

@Entity({ name: "grievances" })
export class Grievance {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index()
  @Column({ type: "uuid" })
  projectId!: string;

  @Column({ type: "text", nullable: true })
  complainantName!: string | null;

  @Column({ type: "text", nullable: true })
  complainantContact!: string | null;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "text", default: "open" })
  status!: "open" | "in_progress" | "closed";

  @Column({ type: "uuid", nullable: true })
  assignedToUserId!: string | null;

  @ManyToOne(() => User, { onDelete: "SET NULL" })
  assignedTo!: User | null;

  @Column({ type: "uuid" })
  createdByUserId!: string;

  @ManyToOne(() => User, { onDelete: "RESTRICT" })
  createdBy!: User;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}

