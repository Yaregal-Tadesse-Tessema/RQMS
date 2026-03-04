import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export type MaterialSourceType = "QUARRY" | "REFINERY" | "CEMENT_PLANT" | "OTHER";

@Entity({ name: "material_sources" })
@Index(["supplierId", "name"])
export class MaterialSource {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index()
  @Column({ type: "uuid" })
  projectId!: string;

  @Index()
  @Column({ type: "uuid" })
  supplierId!: string;

  @Column({ type: "text" })
  sourceType!: MaterialSourceType;

  @Column({ type: "text" })
  name!: string;

  @Column({ type: "text", nullable: true })
  materialType!: string | null;

  @Column({ type: "text", nullable: true })
  location!: string | null;

  @Column({ type: "text", nullable: true })
  licenseNumber!: string | null;

  @Column({ type: "date", nullable: true })
  validFrom!: string | null;

  @Column({ type: "date", nullable: true })
  validTo!: string | null;

  @Column({ type: "text", default: "active" })
  status!: "active" | "inactive";

  @Column({ type: "text", nullable: true })
  notes!: string | null;

  @Column({ type: "uuid" })
  createdByUserId!: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}
