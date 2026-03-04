import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "machinery" })
export class Machinery {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "text" })
  name!: string;

  @Column({ type: "text", nullable: true })
  category!: string | null; // roller, excavator, paver, truck...

  @Column({ type: "text", nullable: true })
  plateOrSerial!: string | null;

  @Column({ type: "text", default: "active" })
  status!: string; // active, maintenance, retired

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}

