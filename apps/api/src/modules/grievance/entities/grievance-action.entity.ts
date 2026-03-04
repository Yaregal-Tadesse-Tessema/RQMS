import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { User } from "../../auth/entities/user.entity";
import { Grievance } from "./grievance.entity";

@Entity({ name: "grievance_actions" })
export class GrievanceAction {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index()
  @Column({ type: "uuid" })
  grievanceId!: string;

  @Column({ type: "text" })
  actionType!: string; // note, assign, close, escalate...

  @Column({ type: "text", nullable: true })
  note!: string | null;

  @Column({ type: "uuid" })
  createdByUserId!: string;

  @ManyToOne(() => Grievance, { onDelete: "CASCADE" })
  grievance!: Grievance;

  @ManyToOne(() => User, { onDelete: "RESTRICT" })
  createdBy!: User;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;
}

