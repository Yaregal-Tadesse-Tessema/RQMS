import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { User } from "../../auth/entities/user.entity";

@Entity({ name: "attachments" })
export class Attachment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "text" })
  bucket!: string;

  @Index()
  @Column({ type: "text" })
  objectKey!: string;

  @Column({ type: "text", nullable: true })
  contentType!: string | null;

  @Column({ type: "bigint", nullable: true })
  sizeBytes!: string | null;

  @Index()
  @Column({ type: "text", nullable: true })
  linkedEntityType!: string | null;

  @Index()
  @Column({ type: "text", nullable: true })
  linkedEntityId!: string | null;

  @Column({ type: "uuid" })
  uploadedByUserId!: string;

  @ManyToOne(() => User, { onDelete: "RESTRICT" })
  uploadedBy!: User;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}

