import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "../auth/entities/user.entity";
import { RoadsService } from "../roads/roads.service";
import { MaterialSource } from "./entities/material-source.entity";
import { SupplierDocument } from "./entities/supplier-document.entity";
import { SupplierPerformance } from "./entities/supplier-performance.entity";
import { Supplier, SupplierStatus } from "./entities/supplier.entity";

@Injectable()
export class SupplierService {
  constructor(
    private readonly roads: RoadsService,
    @InjectRepository(Supplier) private readonly suppliers: Repository<Supplier>,
    @InjectRepository(SupplierDocument) private readonly documents: Repository<SupplierDocument>,
    @InjectRepository(MaterialSource) private readonly sources: Repository<MaterialSource>,
    @InjectRepository(SupplierPerformance) private readonly performance: Repository<SupplierPerformance>
  ) {}

  async createSupplier(
    user: User,
    input: {
      projectId: string;
      name: string;
      registrationNumber?: string | null;
      contactName?: string | null;
      contactPhone?: string | null;
      contactEmail?: string | null;
    }
  ) {
    await this.roads.ensureProjectMember(input.projectId, user);
    return await this.suppliers.save(
      this.suppliers.create({
        projectId: input.projectId,
        name: input.name,
        registrationNumber: input.registrationNumber ?? null,
        contactName: input.contactName ?? null,
        contactPhone: input.contactPhone ?? null,
        contactEmail: input.contactEmail ?? null,
        status: "pending",
        approvedByUserId: null,
        approvedAt: null,
        statusReason: null,
        statusUpdatedAt: null,
        statusUpdatedByUserId: null
      })
    );
  }

  async listSuppliers(user: User, projectId: string) {
    await this.roads.ensureProjectMember(projectId, user);
    return await this.suppliers.find({ where: { projectId }, order: { createdAt: "DESC" } });
  }

  async approveSupplier(user: User, supplierId: string) {
    const supplier = await this.suppliers.findOne({ where: { id: supplierId } });
    if (!supplier) throw new NotFoundException("Supplier not found");
    await this.roads.ensureProjectMember(supplier.projectId, user);

    supplier.status = "approved";
    supplier.approvedAt = new Date();
    supplier.approvedByUserId = user.id;
    supplier.statusUpdatedAt = new Date();
    supplier.statusUpdatedByUserId = user.id;
    supplier.statusReason = null;

    return await this.suppliers.save(supplier);
  }

  async setSupplierStatus(user: User, supplierId: string, status: Exclude<SupplierStatus, "approved" | "pending">, reason?: string) {
    const supplier = await this.suppliers.findOne({ where: { id: supplierId } });
    if (!supplier) throw new NotFoundException("Supplier not found");
    await this.roads.ensureProjectMember(supplier.projectId, user);

    supplier.status = status;
    supplier.statusReason = reason ?? null;
    supplier.statusUpdatedAt = new Date();
    supplier.statusUpdatedByUserId = user.id;

    return await this.suppliers.save(supplier);
  }

  async reinstateSupplier(user: User, supplierId: string, reason?: string) {
    const supplier = await this.suppliers.findOne({ where: { id: supplierId } });
    if (!supplier) throw new NotFoundException("Supplier not found");
    await this.roads.ensureProjectMember(supplier.projectId, user);

    supplier.status = "approved";
    supplier.statusReason = reason ?? null;
    supplier.statusUpdatedAt = new Date();
    supplier.statusUpdatedByUserId = user.id;

    return await this.suppliers.save(supplier);
  }

  async addDocument(
    user: User,
    supplierId: string,
    input: {
      documentType: "LICENSE" | "CERTIFICATION" | "APPROVAL" | "OTHER";
      title: string;
      referenceNumber?: string | null;
      issuingAuthority?: string | null;
      validFrom?: string | null;
      validTo?: string | null;
      notes?: string | null;
    }
  ) {
    const supplier = await this.suppliers.findOne({ where: { id: supplierId } });
    if (!supplier) throw new NotFoundException("Supplier not found");
    await this.roads.ensureProjectMember(supplier.projectId, user);

    return await this.documents.save(
      this.documents.create({
        projectId: supplier.projectId,
        supplierId,
        documentType: input.documentType,
        title: input.title,
        referenceNumber: input.referenceNumber ?? null,
        issuingAuthority: input.issuingAuthority ?? null,
        validFrom: input.validFrom ?? null,
        validTo: input.validTo ?? null,
        notes: input.notes ?? null,
        createdByUserId: user.id
      })
    );
  }

  async listDocuments(user: User, supplierId: string) {
    const supplier = await this.suppliers.findOne({ where: { id: supplierId } });
    if (!supplier) throw new NotFoundException("Supplier not found");
    await this.roads.ensureProjectMember(supplier.projectId, user);
    return await this.documents.find({ where: { supplierId }, order: { createdAt: "DESC" } });
  }

  async addSource(
    user: User,
    supplierId: string,
    input: {
      sourceType: "QUARRY" | "REFINERY" | "CEMENT_PLANT" | "OTHER";
      name: string;
      materialType?: string | null;
      location?: string | null;
      licenseNumber?: string | null;
      validFrom?: string | null;
      validTo?: string | null;
      status?: "active" | "inactive";
      notes?: string | null;
    }
  ) {
    const supplier = await this.suppliers.findOne({ where: { id: supplierId } });
    if (!supplier) throw new NotFoundException("Supplier not found");
    await this.roads.ensureProjectMember(supplier.projectId, user);

    return await this.sources.save(
      this.sources.create({
        projectId: supplier.projectId,
        supplierId,
        sourceType: input.sourceType,
        name: input.name,
        materialType: input.materialType ?? null,
        location: input.location ?? null,
        licenseNumber: input.licenseNumber ?? null,
        validFrom: input.validFrom ?? null,
        validTo: input.validTo ?? null,
        status: input.status ?? "active",
        notes: input.notes ?? null,
        createdByUserId: user.id
      })
    );
  }

  async listSources(user: User, supplierId: string) {
    const supplier = await this.suppliers.findOne({ where: { id: supplierId } });
    if (!supplier) throw new NotFoundException("Supplier not found");
    await this.roads.ensureProjectMember(supplier.projectId, user);
    return await this.sources.find({ where: { supplierId }, order: { createdAt: "DESC" } });
  }

  async addPerformance(
    user: User,
    supplierId: string,
    input: {
      evaluationDate: string;
      qualityScore: number;
      complianceScore: number;
      remarks?: string | null;
    }
  ) {
    const supplier = await this.suppliers.findOne({ where: { id: supplierId } });
    if (!supplier) throw new NotFoundException("Supplier not found");
    await this.roads.ensureProjectMember(supplier.projectId, user);

    return await this.performance.save(
      this.performance.create({
        projectId: supplier.projectId,
        supplierId,
        evaluationDate: input.evaluationDate,
        qualityScore: input.qualityScore,
        complianceScore: input.complianceScore,
        remarks: input.remarks ?? null,
        evaluatedByUserId: user.id
      })
    );
  }

  async listPerformance(user: User, supplierId: string) {
    const supplier = await this.suppliers.findOne({ where: { id: supplierId } });
    if (!supplier) throw new NotFoundException("Supplier not found");
    await this.roads.ensureProjectMember(supplier.projectId, user);
    return await this.performance.find({ where: { supplierId }, order: { evaluationDate: "DESC", createdAt: "DESC" } });
  }
}
