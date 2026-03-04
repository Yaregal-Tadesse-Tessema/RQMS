import { baseApi as api } from "@/lib/api/baseApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    authControllerMe: build.query<
      AuthControllerMeApiResponse,
      AuthControllerMeApiArg
    >({
      query: () => ({ url: `/auth/me` }),
    }),
    healthControllerHealthz: build.query<
      HealthControllerHealthzApiResponse,
      HealthControllerHealthzApiArg
    >({
      query: () => ({ url: `/healthz` }),
    }),
    healthControllerReadyz: build.query<
      HealthControllerReadyzApiResponse,
      HealthControllerReadyzApiArg
    >({
      query: () => ({ url: `/readyz` }),
    }),
    roadsControllerCreateProject: build.mutation<
      RoadsControllerCreateProjectApiResponse,
      RoadsControllerCreateProjectApiArg
    >({
      query: (queryArg) => ({
        url: `/projects`,
        method: "POST",
        body: queryArg.createProjectDto,
      }),
    }),
    roadsControllerListProjects: build.query<
      RoadsControllerListProjectsApiResponse,
      RoadsControllerListProjectsApiArg
    >({
      query: () => ({ url: `/projects` }),
    }),
    roadsControllerCreateRoad: build.mutation<
      RoadsControllerCreateRoadApiResponse,
      RoadsControllerCreateRoadApiArg
    >({
      query: (queryArg) => ({
        url: `/projects/${queryArg.projectId}/roads`,
        method: "POST",
        body: queryArg.createRoadDto,
      }),
    }),
    roadsControllerListRoads: build.query<
      RoadsControllerListRoadsApiResponse,
      RoadsControllerListRoadsApiArg
    >({
      query: (queryArg) => ({ url: `/projects/${queryArg.projectId}/roads` }),
    }),
    roadsControllerCreateSection: build.mutation<
      RoadsControllerCreateSectionApiResponse,
      RoadsControllerCreateSectionApiArg
    >({
      query: (queryArg) => ({
        url: `/roads/${queryArg.roadId}/sections`,
        method: "POST",
        body: queryArg.createRoadSectionDto,
      }),
    }),
    roadsControllerListSections: build.query<
      RoadsControllerListSectionsApiResponse,
      RoadsControllerListSectionsApiArg
    >({
      query: (queryArg) => ({ url: `/roads/${queryArg.roadId}/sections` }),
    }),
    roadsControllerAddElement: build.mutation<
      RoadsControllerAddElementApiResponse,
      RoadsControllerAddElementApiArg
    >({
      query: (queryArg) => ({
        url: `/sections/${queryArg.sectionId}/elements`,
        method: "POST",
        body: queryArg.createRoadElementDto,
      }),
    }),
    roadsControllerAddFeature: build.mutation<
      RoadsControllerAddFeatureApiResponse,
      RoadsControllerAddFeatureApiArg
    >({
      query: (queryArg) => ({
        url: `/sections/${queryArg.sectionId}/features`,
        method: "POST",
        body: queryArg.createRoadFeatureDto,
      }),
    }),
    roadsControllerCreateWorkItem: build.mutation<
      RoadsControllerCreateWorkItemApiResponse,
      RoadsControllerCreateWorkItemApiArg
    >({
      query: (queryArg) => ({
        url: `/sections/${queryArg.sectionId}/work-items`,
        method: "POST",
        body: queryArg.createWorkItemDto,
      }),
    }),
    roadsControllerListWorkItems: build.query<
      RoadsControllerListWorkItemsApiResponse,
      RoadsControllerListWorkItemsApiArg
    >({
      query: (queryArg) => ({
        url: `/sections/${queryArg.sectionId}/work-items`,
      }),
    }),
    roadsControllerAddProgress: build.mutation<
      RoadsControllerAddProgressApiResponse,
      RoadsControllerAddProgressApiArg
    >({
      query: (queryArg) => ({
        url: `/progress`,
        method: "POST",
        body: queryArg.createDailyProgressDto,
      }),
    }),
    dashboardControllerOverview: build.query<
      DashboardControllerOverviewApiResponse,
      DashboardControllerOverviewApiArg
    >({
      query: () => ({ url: `/dashboard/overview` }),
    }),
    dashboardControllerProject: build.query<
      DashboardControllerProjectApiResponse,
      DashboardControllerProjectApiArg
    >({
      query: (queryArg) => ({
        url: `/dashboard/projects/${queryArg.projectId}`,
        params: {
          workDate: queryArg.workDate,
        },
      }),
    }),
    machineryControllerCreateMachinery: build.mutation<
      MachineryControllerCreateMachineryApiResponse,
      MachineryControllerCreateMachineryApiArg
    >({
      query: (queryArg) => ({
        url: `/machinery`,
        method: "POST",
        body: queryArg.createMachineryDto,
      }),
    }),
    machineryControllerListMachinery: build.query<
      MachineryControllerListMachineryApiResponse,
      MachineryControllerListMachineryApiArg
    >({
      query: () => ({ url: `/machinery` }),
    }),
    machineryControllerRequestFuel: build.mutation<
      MachineryControllerRequestFuelApiResponse,
      MachineryControllerRequestFuelApiArg
    >({
      query: (queryArg) => ({
        url: `/fuel/requests`,
        method: "POST",
        body: queryArg.createFuelRequestDto,
      }),
    }),
    machineryControllerApprove: build.mutation<
      MachineryControllerApproveApiResponse,
      MachineryControllerApproveApiArg
    >({
      query: (queryArg) => ({
        url: `/fuel/requests/${queryArg.id}/approve`,
        method: "POST",
        body: queryArg.approveFuelRequestDto,
      }),
    }),
    machineryControllerIssue: build.mutation<
      MachineryControllerIssueApiResponse,
      MachineryControllerIssueApiArg
    >({
      query: (queryArg) => ({
        url: `/fuel/issues`,
        method: "POST",
        body: queryArg.createFuelIssueDto,
      }),
    }),
    safetyControllerCreateInspection: build.mutation<
      SafetyControllerCreateInspectionApiResponse,
      SafetyControllerCreateInspectionApiArg
    >({
      query: (queryArg) => ({
        url: `/safety/inspections`,
        method: "POST",
        body: queryArg.createSafetyInspectionDto,
      }),
    }),
    safetyControllerListInspections: build.query<
      SafetyControllerListInspectionsApiResponse,
      SafetyControllerListInspectionsApiArg
    >({
      query: (queryArg) => ({
        url: `/safety/inspections/${queryArg.projectId}`,
      }),
    }),
    safetyControllerCreateIncident: build.mutation<
      SafetyControllerCreateIncidentApiResponse,
      SafetyControllerCreateIncidentApiArg
    >({
      query: (queryArg) => ({
        url: `/incidents`,
        method: "POST",
        body: queryArg.createIncidentDto,
      }),
    }),
    safetyControllerListIncidents: build.query<
      SafetyControllerListIncidentsApiResponse,
      SafetyControllerListIncidentsApiArg
    >({
      query: (queryArg) => ({ url: `/incidents/${queryArg.projectId}` }),
    }),
    environmentControllerCreateRecord: build.mutation<
      EnvironmentControllerCreateRecordApiResponse,
      EnvironmentControllerCreateRecordApiArg
    >({
      query: (queryArg) => ({
        url: `/environment/records`,
        method: "POST",
        body: queryArg.createEnvironmentalRecordDto,
      }),
    }),
    environmentControllerList: build.query<
      EnvironmentControllerListApiResponse,
      EnvironmentControllerListApiArg
    >({
      query: (queryArg) => ({
        url: `/environment/records/${queryArg.projectId}`,
      }),
    }),
    grievanceControllerCreate: build.mutation<
      GrievanceControllerCreateApiResponse,
      GrievanceControllerCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/grievances`,
        method: "POST",
        body: queryArg.createGrievanceDto,
      }),
    }),
    grievanceControllerList: build.query<
      GrievanceControllerListApiResponse,
      GrievanceControllerListApiArg
    >({
      query: (queryArg) => ({ url: `/grievances/${queryArg.projectId}` }),
    }),
    grievanceControllerAddAction: build.mutation<
      GrievanceControllerAddActionApiResponse,
      GrievanceControllerAddActionApiArg
    >({
      query: (queryArg) => ({
        url: `/grievances/actions`,
        method: "POST",
        body: queryArg.addGrievanceActionDto,
      }),
    }),
    qaControllerCreateTemplate: build.mutation<
      QaControllerCreateTemplateApiResponse,
      QaControllerCreateTemplateApiArg
    >({
      query: (queryArg) => ({
        url: `/checklists/templates`,
        method: "POST",
        body: queryArg.createChecklistTemplateDto,
      }),
    }),
    qaControllerCreateInspection: build.mutation<
      QaControllerCreateInspectionApiResponse,
      QaControllerCreateInspectionApiArg
    >({
      query: (queryArg) => ({
        url: `/inspections`,
        method: "POST",
        body: queryArg.createInspectionDto,
      }),
    }),
    qaControllerCloseRework: build.mutation<
      QaControllerCloseReworkApiResponse,
      QaControllerCloseReworkApiArg
    >({
      query: (queryArg) => ({
        url: `/rework/close`,
        method: "POST",
        body: queryArg.closeReworkDto,
      }),
    }),
    supplierControllerCreateSupplier: build.mutation<
      SupplierControllerCreateSupplierApiResponse,
      SupplierControllerCreateSupplierApiArg
    >({
      query: (queryArg) => ({
        url: `/suppliers`,
        method: "POST",
        body: queryArg.createSupplierDto,
      }),
    }),
    supplierControllerListSuppliers: build.query<
      SupplierControllerListSuppliersApiResponse,
      SupplierControllerListSuppliersApiArg
    >({
      query: (queryArg) => ({ url: `/suppliers/${queryArg.projectId}` }),
    }),
    supplierControllerApproveSupplier: build.mutation<
      SupplierControllerApproveSupplierApiResponse,
      SupplierControllerApproveSupplierApiArg
    >({
      query: (queryArg) => ({
        url: `/suppliers/${queryArg.supplierId}/approve`,
        method: "POST",
      }),
    }),
    supplierControllerUpdateStatus: build.mutation<
      SupplierControllerUpdateStatusApiResponse,
      SupplierControllerUpdateStatusApiArg
    >({
      query: (queryArg) => ({
        url: `/suppliers/${queryArg.supplierId}/status`,
        method: "POST",
        body: queryArg.updateSupplierStatusDto,
      }),
    }),
    supplierControllerReinstate: build.mutation<
      SupplierControllerReinstateApiResponse,
      SupplierControllerReinstateApiArg
    >({
      query: (queryArg) => ({
        url: `/suppliers/${queryArg.supplierId}/reinstate`,
        method: "POST",
        body: queryArg.reinstateSupplierDto,
      }),
    }),
    supplierControllerAddDocument: build.mutation<
      SupplierControllerAddDocumentApiResponse,
      SupplierControllerAddDocumentApiArg
    >({
      query: (queryArg) => ({
        url: `/suppliers/${queryArg.supplierId}/documents`,
        method: "POST",
        body: queryArg.createSupplierDocumentDto,
      }),
    }),
    supplierControllerListDocuments: build.query<
      SupplierControllerListDocumentsApiResponse,
      SupplierControllerListDocumentsApiArg
    >({
      query: (queryArg) => ({
        url: `/suppliers/${queryArg.supplierId}/documents`,
      }),
    }),
    supplierControllerAddSource: build.mutation<
      SupplierControllerAddSourceApiResponse,
      SupplierControllerAddSourceApiArg
    >({
      query: (queryArg) => ({
        url: `/suppliers/${queryArg.supplierId}/sources`,
        method: "POST",
        body: queryArg.createMaterialSourceDto,
      }),
    }),
    supplierControllerListSources: build.query<
      SupplierControllerListSourcesApiResponse,
      SupplierControllerListSourcesApiArg
    >({
      query: (queryArg) => ({
        url: `/suppliers/${queryArg.supplierId}/sources`,
      }),
    }),
    supplierControllerAddPerformance: build.mutation<
      SupplierControllerAddPerformanceApiResponse,
      SupplierControllerAddPerformanceApiArg
    >({
      query: (queryArg) => ({
        url: `/suppliers/${queryArg.supplierId}/performance`,
        method: "POST",
        body: queryArg.createSupplierPerformanceDto,
      }),
    }),
    supplierControllerListPerformance: build.query<
      SupplierControllerListPerformanceApiResponse,
      SupplierControllerListPerformanceApiArg
    >({
      query: (queryArg) => ({
        url: `/suppliers/${queryArg.supplierId}/performance`,
      }),
    }),
    attachmentsControllerPresign: build.mutation<
      AttachmentsControllerPresignApiResponse,
      AttachmentsControllerPresignApiArg
    >({
      query: (queryArg) => ({
        url: `/attachments/presign`,
        method: "POST",
        body: queryArg.presignUploadDto,
      }),
    }),
    attachmentsControllerLink: build.mutation<
      AttachmentsControllerLinkApiResponse,
      AttachmentsControllerLinkApiArg
    >({
      query: (queryArg) => ({
        url: `/attachments/link`,
        method: "POST",
        body: queryArg.linkAttachmentDto,
      }),
    }),
    attachmentsControllerDownload: build.query<
      AttachmentsControllerDownloadApiResponse,
      AttachmentsControllerDownloadApiArg
    >({
      query: (queryArg) => ({ url: `/attachments/${queryArg.id}` }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as rqmsApi };
export type AuthControllerMeApiResponse = unknown;
export type AuthControllerMeApiArg = void;
export type HealthControllerHealthzApiResponse = unknown;
export type HealthControllerHealthzApiArg = void;
export type HealthControllerReadyzApiResponse = unknown;
export type HealthControllerReadyzApiArg = void;
export type RoadsControllerCreateProjectApiResponse = unknown;
export type RoadsControllerCreateProjectApiArg = {
  createProjectDto: CreateProjectDto;
};
export type RoadsControllerListProjectsApiResponse = unknown;
export type RoadsControllerListProjectsApiArg = void;
export type RoadsControllerCreateRoadApiResponse = unknown;
export type RoadsControllerCreateRoadApiArg = {
  projectId: string;
  createRoadDto: CreateRoadDto;
};
export type RoadsControllerListRoadsApiResponse = unknown;
export type RoadsControllerListRoadsApiArg = {
  projectId: string;
};
export type RoadsControllerCreateSectionApiResponse = unknown;
export type RoadsControllerCreateSectionApiArg = {
  roadId: string;
  createRoadSectionDto: CreateRoadSectionDto;
};
export type RoadsControllerListSectionsApiResponse = unknown;
export type RoadsControllerListSectionsApiArg = {
  roadId: string;
};
export type RoadsControllerAddElementApiResponse = unknown;
export type RoadsControllerAddElementApiArg = {
  sectionId: string;
  createRoadElementDto: CreateRoadElementDto;
};
export type RoadsControllerAddFeatureApiResponse = unknown;
export type RoadsControllerAddFeatureApiArg = {
  sectionId: string;
  createRoadFeatureDto: CreateRoadFeatureDto;
};
export type RoadsControllerCreateWorkItemApiResponse = unknown;
export type RoadsControllerCreateWorkItemApiArg = {
  sectionId: string;
  createWorkItemDto: CreateWorkItemDto;
};
export type RoadsControllerListWorkItemsApiResponse = unknown;
export type RoadsControllerListWorkItemsApiArg = {
  sectionId: string;
};
export type RoadsControllerAddProgressApiResponse = unknown;
export type RoadsControllerAddProgressApiArg = {
  createDailyProgressDto: CreateDailyProgressDto;
};
export type DashboardControllerOverviewApiResponse =
  /** status 200  */ DashboardOverviewDto;
export type DashboardControllerOverviewApiArg = void;
export type DashboardControllerProjectApiResponse =
  /** status 200  */ ProjectDashboardDto;
export type DashboardControllerProjectApiArg = {
  projectId: string;
  workDate: string;
};
export type MachineryControllerCreateMachineryApiResponse = unknown;
export type MachineryControllerCreateMachineryApiArg = {
  createMachineryDto: CreateMachineryDto;
};
export type MachineryControllerListMachineryApiResponse = unknown;
export type MachineryControllerListMachineryApiArg = void;
export type MachineryControllerRequestFuelApiResponse = unknown;
export type MachineryControllerRequestFuelApiArg = {
  createFuelRequestDto: CreateFuelRequestDto;
};
export type MachineryControllerApproveApiResponse = unknown;
export type MachineryControllerApproveApiArg = {
  id: string;
  approveFuelRequestDto: ApproveFuelRequestDto;
};
export type MachineryControllerIssueApiResponse = unknown;
export type MachineryControllerIssueApiArg = {
  createFuelIssueDto: CreateFuelIssueDto;
};
export type SafetyControllerCreateInspectionApiResponse = unknown;
export type SafetyControllerCreateInspectionApiArg = {
  createSafetyInspectionDto: CreateSafetyInspectionDto;
};
export type SafetyControllerListInspectionsApiResponse = unknown;
export type SafetyControllerListInspectionsApiArg = {
  projectId: string;
};
export type SafetyControllerCreateIncidentApiResponse = unknown;
export type SafetyControllerCreateIncidentApiArg = {
  createIncidentDto: CreateIncidentDto;
};
export type SafetyControllerListIncidentsApiResponse = unknown;
export type SafetyControllerListIncidentsApiArg = {
  projectId: string;
};
export type EnvironmentControllerCreateRecordApiResponse = unknown;
export type EnvironmentControllerCreateRecordApiArg = {
  createEnvironmentalRecordDto: CreateEnvironmentalRecordDto;
};
export type EnvironmentControllerListApiResponse = unknown;
export type EnvironmentControllerListApiArg = {
  projectId: string;
};
export type GrievanceControllerCreateApiResponse = unknown;
export type GrievanceControllerCreateApiArg = {
  createGrievanceDto: CreateGrievanceDto;
};
export type GrievanceControllerListApiResponse = unknown;
export type GrievanceControllerListApiArg = {
  projectId: string;
};
export type GrievanceControllerAddActionApiResponse = unknown;
export type GrievanceControllerAddActionApiArg = {
  addGrievanceActionDto: AddGrievanceActionDto;
};
export type QaControllerCreateTemplateApiResponse = unknown;
export type QaControllerCreateTemplateApiArg = {
  createChecklistTemplateDto: CreateChecklistTemplateDto;
};
export type QaControllerCreateInspectionApiResponse = unknown;
export type QaControllerCreateInspectionApiArg = {
  createInspectionDto: CreateInspectionDto;
};
export type QaControllerCloseReworkApiResponse = unknown;
export type QaControllerCloseReworkApiArg = {
  closeReworkDto: CloseReworkDto;
};
export type SupplierControllerCreateSupplierApiResponse = unknown;
export type SupplierControllerCreateSupplierApiArg = {
  createSupplierDto: CreateSupplierDto;
};
export type SupplierControllerListSuppliersApiResponse = unknown;
export type SupplierControllerListSuppliersApiArg = {
  projectId: string;
};
export type SupplierControllerApproveSupplierApiResponse = unknown;
export type SupplierControllerApproveSupplierApiArg = {
  supplierId: string;
};
export type SupplierControllerUpdateStatusApiResponse = unknown;
export type SupplierControllerUpdateStatusApiArg = {
  supplierId: string;
  updateSupplierStatusDto: UpdateSupplierStatusDto;
};
export type SupplierControllerReinstateApiResponse = unknown;
export type SupplierControllerReinstateApiArg = {
  supplierId: string;
  reinstateSupplierDto: ReinstateSupplierDto;
};
export type SupplierControllerAddDocumentApiResponse = unknown;
export type SupplierControllerAddDocumentApiArg = {
  supplierId: string;
  createSupplierDocumentDto: CreateSupplierDocumentDto;
};
export type SupplierControllerListDocumentsApiResponse = unknown;
export type SupplierControllerListDocumentsApiArg = {
  supplierId: string;
};
export type SupplierControllerAddSourceApiResponse = unknown;
export type SupplierControllerAddSourceApiArg = {
  supplierId: string;
  createMaterialSourceDto: CreateMaterialSourceDto;
};
export type SupplierControllerListSourcesApiResponse = unknown;
export type SupplierControllerListSourcesApiArg = {
  supplierId: string;
};
export type SupplierControllerAddPerformanceApiResponse = unknown;
export type SupplierControllerAddPerformanceApiArg = {
  supplierId: string;
  createSupplierPerformanceDto: CreateSupplierPerformanceDto;
};
export type SupplierControllerListPerformanceApiResponse = unknown;
export type SupplierControllerListPerformanceApiArg = {
  supplierId: string;
};
export type AttachmentsControllerPresignApiResponse = unknown;
export type AttachmentsControllerPresignApiArg = {
  presignUploadDto: PresignUploadDto;
};
export type AttachmentsControllerLinkApiResponse = unknown;
export type AttachmentsControllerLinkApiArg = {
  linkAttachmentDto: LinkAttachmentDto;
};
export type AttachmentsControllerDownloadApiResponse = unknown;
export type AttachmentsControllerDownloadApiArg = {
  id: string;
};
export type CreateProjectDto = {
  name: string;
  projectType: "ROAD" | "BRIDGE" | "DRAINAGE" | "OTHER";
};
export type CreateRoadDto = {
  name: string;
  /** Unique code within the project. */
  code: string;
  /** Free text, e.g. highway, city road. */
  roadType?: string;
};
export type CreateRoadSectionDto = {
  name: string;
  startChainage?: number;
  endChainage?: number;
};
export type CreateRoadElementDto = {
  /** e.g. sidewalk, bike_lane, drainage, lighting */
  elementType: string;
  fromChainage?: number;
  toChainage?: number;
};
export type CreateRoadFeatureDto = {
  /** e.g. inlet, sign, crossing, pole */
  featureType: string;
  chainage?: number;
  lat?: number;
  lng?: number;
};
export type CreateWorkItemDto = {
  name: string;
  /** Unit of measure, e.g. m, m2, m3, ton, item */
  unit: string;
  roadElementId?: string;
  roadFeatureId?: string;
  workLayerId?: string;
  activityTypeId?: string;
};
export type CreateDailyProgressDto = {
  workItemId: string;
  /** YYYY-MM-DD */
  workDate: string;
  quantity: number;
  fromChainage?: number;
  toChainage?: number;
  lat?: number;
  lng?: number;
  weather?: object;
  notes?: string;
};
export type DashboardProjectLiteDto = {
  id: string;
  name: string;
  projectType: "ROAD" | "BRIDGE" | "DRAINAGE" | "OTHER";
  /** ISO timestamp */
  createdAt: string;
};
export type DashboardOverviewDto = {
  projectsCount: number;
  recentProjects: DashboardProjectLiteDto[];
};
export type DashboardCountsDto = {
  roads: number;
  sections: number;
  workItems: number;
  /** Number of daily progress entries on workDate. */
  progressEntriesOnDate: number;
  /** Sum(quantity) of daily progress entries on workDate. */
  progressQuantityOnDate: number;
  /** Open rework records linked to failed inspections. */
  openFailedReworks: number;
  fuelRequestsRequested: number;
  fuelRequestsApproved: number;
  fuelIssues: number;
  safetyInspections: number;
  incidents: number;
  environmentalRecords: number;
  grievancesOpen: number;
  grievancesTotal: number;
};
export type DashboardFuelRequestLiteDto = {
  id: string;
  status: string;
  requestedLiters: number;
  /** ISO timestamp */
  createdAt: string;
};
export type DashboardIncidentLiteDto = {
  id: string;
  /** ISO timestamp */
  occurredAt: string;
  severity: "low" | "medium" | "high";
  description: string;
};
export type DashboardEnvironmentalLiteDto = {
  id: string;
  parameter: string;
  value?: object | null;
  unit?: object | null;
  /** ISO timestamp */
  capturedAt: string;
};
export type DashboardGrievanceLiteDto = {
  id: string;
  status: string;
  description: string;
  /** ISO timestamp */
  createdAt: string;
};
export type ProjectDashboardDto = {
  projectId: string;
  /** YYYY-MM-DD */
  workDate: string;
  counts: DashboardCountsDto;
  recentFuelRequests: DashboardFuelRequestLiteDto[];
  recentIncidents: DashboardIncidentLiteDto[];
  recentEnvironmentalRecords: DashboardEnvironmentalLiteDto[];
  recentGrievances: DashboardGrievanceLiteDto[];
};
export type CreateMachineryDto = {
  name: string;
  category?: string;
  plateOrSerial?: string;
};
export type CreateFuelRequestDto = {
  projectId: string;
  machineryId: string;
  requestedLiters: number;
};
export type ApproveFuelRequestDto = {
  note?: string;
};
export type CreateFuelIssueDto = {
  projectId: string;
  machineryId: string;
  fuelRequestId?: string;
  issuedLiters: number;
};
export type CreateSafetyInspectionDto = {
  projectId: string;
  /** YYYY-MM-DD */
  inspectionDate: string;
  title?: string;
  notes?: string;
};
export type CreateIncidentDto = {
  projectId: string;
  /** ISO timestamp */
  occurredAt: string;
  severity: "low" | "medium" | "high";
  description: string;
  lat?: number;
  lng?: number;
};
export type CreateEnvironmentalRecordDto = {
  projectId: string;
  /** ISO timestamp */
  capturedAt: string;
  /** e.g. dust, noise, waste */
  parameter: string;
  value?: number;
  unit?: string;
  notes?: string;
};
export type CreateGrievanceDto = {
  projectId: string;
  description: string;
  complainantName?: string;
  complainantContact?: string;
};
export type AddGrievanceActionDto = {
  grievanceId: string;
  /** note, assign, close, escalate... */
  actionType: string;
  note?: string;
};
export type CreateChecklistTemplateDto = {
  projectId: string;
  name: string;
  items: string[];
};
export type CreateInspectionDto = {
  projectId: string;
  workItemId: string;
  checklistTemplateId?: string;
  fromChainage?: number;
  toChainage?: number;
  outcome: "pass" | "conditional" | "fail";
  notes?: string;
  /** ISO timestamp */
  inspectedAt: string;
};
export type CloseReworkDto = {
  inspectionId: string;
  note?: string;
};
export type CreateSupplierDto = {
  projectId: string;
  name: string;
  registrationNumber?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
};
export type UpdateSupplierStatusDto = {
  status: "suspended" | "blacklisted";
  reason?: string;
};
export type ReinstateSupplierDto = {
  reason?: string;
};
export type CreateSupplierDocumentDto = {
  documentType: "LICENSE" | "CERTIFICATION" | "APPROVAL" | "OTHER";
  title: string;
  referenceNumber?: string;
  issuingAuthority?: string;
  /** YYYY-MM-DD */
  validFrom?: string;
  /** YYYY-MM-DD */
  validTo?: string;
  notes?: string;
};
export type CreateMaterialSourceDto = {
  sourceType: "QUARRY" | "REFINERY" | "CEMENT_PLANT" | "OTHER";
  name: string;
  materialType?: string;
  location?: string;
  licenseNumber?: string;
  /** YYYY-MM-DD */
  validFrom?: string;
  /** YYYY-MM-DD */
  validTo?: string;
  status?: string;
  notes?: string;
};
export type CreateSupplierPerformanceDto = {
  /** YYYY-MM-DD */
  evaluationDate: string;
  qualityScore: number;
  complianceScore: number;
  remarks?: string;
};
export type PresignUploadDto = {
  fileName?: string;
  contentType?: string;
  /** Optional key prefix, e.g. 'progress/' */
  keyPrefix?: string;
};
export type LinkAttachmentDto = {
  /** The object key returned by /attachments/presign. */
  objectKey: string;
  contentType?: string;
  sizeBytes?: string;
  /** e.g. daily_progress, inspection, incident */
  linkedEntityType?: string;
  linkedEntityId?: string;
};
export const {
  useAuthControllerMeQuery,
  useHealthControllerHealthzQuery,
  useHealthControllerReadyzQuery,
  useRoadsControllerCreateProjectMutation,
  useRoadsControllerListProjectsQuery,
  useRoadsControllerCreateRoadMutation,
  useRoadsControllerListRoadsQuery,
  useRoadsControllerCreateSectionMutation,
  useRoadsControllerListSectionsQuery,
  useRoadsControllerAddElementMutation,
  useRoadsControllerAddFeatureMutation,
  useRoadsControllerCreateWorkItemMutation,
  useRoadsControllerListWorkItemsQuery,
  useRoadsControllerAddProgressMutation,
  useDashboardControllerOverviewQuery,
  useDashboardControllerProjectQuery,
  useMachineryControllerCreateMachineryMutation,
  useMachineryControllerListMachineryQuery,
  useMachineryControllerRequestFuelMutation,
  useMachineryControllerApproveMutation,
  useMachineryControllerIssueMutation,
  useSafetyControllerCreateInspectionMutation,
  useSafetyControllerListInspectionsQuery,
  useSafetyControllerCreateIncidentMutation,
  useSafetyControllerListIncidentsQuery,
  useEnvironmentControllerCreateRecordMutation,
  useEnvironmentControllerListQuery,
  useGrievanceControllerCreateMutation,
  useGrievanceControllerListQuery,
  useGrievanceControllerAddActionMutation,
  useQaControllerCreateTemplateMutation,
  useQaControllerCreateInspectionMutation,
  useQaControllerCloseReworkMutation,
  useSupplierControllerCreateSupplierMutation,
  useSupplierControllerListSuppliersQuery,
  useSupplierControllerApproveSupplierMutation,
  useSupplierControllerUpdateStatusMutation,
  useSupplierControllerReinstateMutation,
  useSupplierControllerAddDocumentMutation,
  useSupplierControllerListDocumentsQuery,
  useSupplierControllerAddSourceMutation,
  useSupplierControllerListSourcesQuery,
  useSupplierControllerAddPerformanceMutation,
  useSupplierControllerListPerformanceQuery,
  useAttachmentsControllerPresignMutation,
  useAttachmentsControllerLinkMutation,
  useAttachmentsControllerDownloadQuery,
} = injectedRtkApi;
