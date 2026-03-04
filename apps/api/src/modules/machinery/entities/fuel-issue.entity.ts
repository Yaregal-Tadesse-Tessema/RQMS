import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { User } from "../../auth/entities/user.entity";
import { Machinery } from "./machinery.entity";
import { FuelRequest } from "./fuel-request.entity";

@Entity({ name: "fuel_issues" })
export class FuelIssue {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index()
  @Column({ type: "uuid" })
  projectId!: string;

  @Column({ type: "uuid" })
  machineryId!: string;

  @Column({ type: "uuid", nullable: true })
  fuelRequestId!: string | null;

  @Column({ type: "double precision" })
  issuedLiters!: number;

  @Column({ type: "uuid" })
  issuedByUserId!: string;

  @ManyToOne(() => Machinery, { onDelete: "RESTRICT" })
  machinery!: Machinery;

  @ManyToOne(() => FuelRequest, { onDelete: "SET NULL" })
  fuelRequest!: FuelRequest | null;

  @ManyToOne(() => User, { onDelete: "RESTRICT" })
  issuedBy!: User;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;
}

