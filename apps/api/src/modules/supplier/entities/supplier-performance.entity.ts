import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "supplier_performance_history" })
@Index(["supplierId", "evaluationDate"])
export class SupplierPerformance {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index()
  @Column({ type: "uuid" })
  projectId!: string;

  @Index()
  @Column({ type: "uuid" })
  supplierId!: string;

  @Column({ type: "date" })
  evaluationDate!: string;

  @Column({ type: "double precision" })
  qualityScore!: number;

  @Column({ type: "double precision" })
  complianceScore!: number;

  @Column({ type: "text", nullable: true })
  remarks!: string | null;

  @Column({ type: "uuid" })
  evaluatedByUserId!: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}
