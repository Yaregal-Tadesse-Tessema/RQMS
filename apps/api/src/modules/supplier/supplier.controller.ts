import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { User } from "../auth/entities/user.entity";
import { CurrentUser } from "../auth/http/current-user.decorator";
import { JwtJwksAuthGuard } from "../auth/http/jwt-jwks-auth.guard";
import { CreateMaterialSourceDto } from "./dto/create-material-source.dto";
import { CreateSupplierDocumentDto } from "./dto/create-supplier-document.dto";
import { CreateSupplierPerformanceDto } from "./dto/create-supplier-performance.dto";
import { CreateSupplierDto } from "./dto/create-supplier.dto";
import { ReinstateSupplierDto } from "./dto/reinstate-supplier.dto";
import { UpdateSupplierStatusDto } from "./dto/update-supplier-status.dto";
import { SupplierService } from "./supplier.service";

@ApiTags("suppliers")
@ApiBearerAuth()
@UseGuards(JwtJwksAuthGuard)
@Controller()
export class SupplierController {
  constructor(private readonly svc: SupplierService) {}

  @Post("/suppliers")
  createSupplier(@CurrentUser() user: User, @Body() dto: CreateSupplierDto) {
    return this.svc.createSupplier(user, {
      projectId: dto.projectId,
      name: dto.name,
      registrationNumber: dto.registrationNumber ?? null,
      contactName: dto.contactName ?? null,
      contactPhone: dto.contactPhone ?? null,
      contactEmail: dto.contactEmail ?? null
    });
  }

  @Get("/suppliers/:projectId")
  listSuppliers(@CurrentUser() user: User, @Param("projectId") projectId: string) {
    return this.svc.listSuppliers(user, projectId);
  }

  @Post("/suppliers/:supplierId/approve")
  approveSupplier(@CurrentUser() user: User, @Param("supplierId") supplierId: string) {
    return this.svc.approveSupplier(user, supplierId);
  }

  @Post("/suppliers/:supplierId/status")
  updateStatus(@CurrentUser() user: User, @Param("supplierId") supplierId: string, @Body() dto: UpdateSupplierStatusDto) {
    return this.svc.setSupplierStatus(user, supplierId, dto.status, dto.reason);
  }

  @Post("/suppliers/:supplierId/reinstate")
  reinstate(@CurrentUser() user: User, @Param("supplierId") supplierId: string, @Body() dto: ReinstateSupplierDto) {
    return this.svc.reinstateSupplier(user, supplierId, dto.reason);
  }

  @Post("/suppliers/:supplierId/documents")
  addDocument(@CurrentUser() user: User, @Param("supplierId") supplierId: string, @Body() dto: CreateSupplierDocumentDto) {
    return this.svc.addDocument(user, supplierId, {
      documentType: dto.documentType,
      title: dto.title,
      referenceNumber: dto.referenceNumber ?? null,
      issuingAuthority: dto.issuingAuthority ?? null,
      validFrom: dto.validFrom ?? null,
      validTo: dto.validTo ?? null,
      notes: dto.notes ?? null
    });
  }

  @Get("/suppliers/:supplierId/documents")
  listDocuments(@CurrentUser() user: User, @Param("supplierId") supplierId: string) {
    return this.svc.listDocuments(user, supplierId);
  }

  @Post("/suppliers/:supplierId/sources")
  addSource(@CurrentUser() user: User, @Param("supplierId") supplierId: string, @Body() dto: CreateMaterialSourceDto) {
    return this.svc.addSource(user, supplierId, {
      sourceType: dto.sourceType,
      name: dto.name,
      materialType: dto.materialType ?? null,
      location: dto.location ?? null,
      licenseNumber: dto.licenseNumber ?? null,
      validFrom: dto.validFrom ?? null,
      validTo: dto.validTo ?? null,
      status: dto.status ?? "active",
      notes: dto.notes ?? null
    });
  }

  @Get("/suppliers/:supplierId/sources")
  listSources(@CurrentUser() user: User, @Param("supplierId") supplierId: string) {
    return this.svc.listSources(user, supplierId);
  }

  @Post("/suppliers/:supplierId/performance")
  addPerformance(@CurrentUser() user: User, @Param("supplierId") supplierId: string, @Body() dto: CreateSupplierPerformanceDto) {
    return this.svc.addPerformance(user, supplierId, {
      evaluationDate: dto.evaluationDate,
      qualityScore: dto.qualityScore,
      complianceScore: dto.complianceScore,
      remarks: dto.remarks ?? null
    });
  }

  @Get("/suppliers/:supplierId/performance")
  listPerformance(@CurrentUser() user: User, @Param("supplierId") supplierId: string) {
    return this.svc.listPerformance(user, supplierId);
  }
}
