import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { User } from "../../auth/entities/user.entity";
import { Machinery } from "./machinery.entity";

@Entity({ name: "fuel_requests" })
export class FuelRequest {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index()
  @Column({ type: "uuid" })
  projectId!: string;

  @Column({ type: "uuid" })
  machineryId!: string;

  @Column({ type: "double precision" })
  requestedLiters!: number;

  @Column({ type: "text", default: "requested" })
  status!: "requested" | "approved" | "rejected" | "issued";

  @Column({ type: "uuid" })
  requestedByUserId!: string;

  @Column({ type: "uuid", nullable: true })
  approvedByUserId!: string | null;

  @Column({ type: "timestamptz", nullable: true })
  approvedAt!: Date | null;

  @Column({ type: "text", nullable: true })
  approvalNote!: string | null;

  @ManyToOne(() => Machinery, { onDelete: "RESTRICT" })
  machinery!: Machinery;

  @ManyToOne(() => User, { onDelete: "RESTRICT" })
  requestedBy!: User;

  @ManyToOne(() => User, { onDelete: "RESTRICT" })
  approvedBy!: User | null;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}

