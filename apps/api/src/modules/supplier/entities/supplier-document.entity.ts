import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export type SupplierDocumentType = "LICENSE" | "CERTIFICATION" | "APPROVAL" | "OTHER";

@Entity({ name: "supplier_documents" })
@Index(["supplierId", "documentType"])
export class SupplierDocument {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index()
  @Column({ type: "uuid" })
  projectId!: string;

  @Index()
  @Column({ type: "uuid" })
  supplierId!: string;

  @Column({ type: "text" })
  documentType!: SupplierDocumentType;

  @Column({ type: "text" })
  title!: string;

  @Column({ type: "text", nullable: true })
  referenceNumber!: string | null;

  @Column({ type: "text", nullable: true })
  issuingAuthority!: string | null;

  @Column({ type: "date", nullable: true })
  validFrom!: string | null;

  @Column({ type: "date", nullable: true })
  validTo!: string | null;

  @Column({ type: "text", nullable: true })
  notes!: string | null;

  @Column({ type: "uuid" })
  createdByUserId!: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}
