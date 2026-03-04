import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export type SupplierStatus = "pending" | "approved" | "suspended" | "blacklisted";

@Entity({ name: "suppliers" })
@Index(["projectId", "name"])
export class Supplier {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index()
  @Column({ type: "uuid" })
  projectId!: string;

  @Column({ type: "text" })
  name!: string;

  @Column({ type: "text", nullable: true })
  registrationNumber!: string | null;

  @Column({ type: "text", nullable: true })
  contactName!: string | null;

  @Column({ type: "text", nullable: true })
  contactPhone!: string | null;

  @Column({ type: "text", nullable: true })
  contactEmail!: string | null;

  @Column({ type: "text", default: "pending" })
  status!: SupplierStatus;

  @Column({ type: "uuid", nullable: true })
  approvedByUserId!: string | null;

  @Column({ type: "timestamptz", nullable: true })
  approvedAt!: Date | null;

  @Column({ type: "text", nullable: true })
  statusReason!: string | null;

  @Column({ type: "timestamptz", nullable: true })
  statusUpdatedAt!: Date | null;

  @Column({ type: "uuid", nullable: true })
  statusUpdatedByUserId!: string | null;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}
