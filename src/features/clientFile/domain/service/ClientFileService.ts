/* eslint-disable no-unused-vars */
import { ClientFileDTO } from '@features/clientFile/presentation/dto/ClientFileDTO';
import { ClientFilePaginationDTO } from '@features/clientFile/presentation/dto/ClientFilePaginationDTO';
import { ClientFileActivityRequest } from '@features/clientFile/presentation/request/ClientFileActivityRequest';
import { ClientFileAddressRequest } from '@features/clientFile/presentation/request/ClientFileAddressRequest';
import { ClientFileComplianceRequest } from '@features/clientFile/presentation/request/ClientFileComplianceRequest';
import { ClientFileCreateRequest } from '@features/clientFile/presentation/request/ClientFileCreateRequest';
import { ClientFileFundOriginRequest } from '@features/clientFile/presentation/request/ClientFileFundOriginRequest';
import { ClientFileIdentityRequest } from '@features/clientFile/presentation/request/ClientFileIdentityRequest';
import { ClientFileInternationalRequest } from '@features/clientFile/presentation/request/ClientFileInternationalRequest';
import { ClientFileListRequest } from '@features/clientFile/presentation/request/ClientFileListRequest';
import { ClientFileOperationRequest } from '@features/clientFile/presentation/request/ClientFileOperationRequest';
import { ClientFilePepRequest } from '@features/clientFile/presentation/request/ClientFilePepRequest';
import { ClientFileServicesRequest } from '@features/clientFile/presentation/request/ClientFileServicesRequest';
import { ClientFileSituationRequest } from '@features/clientFile/presentation/request/ClientFileSituationRequest';
import { FileStatus } from '@prisma/client';

export interface ClientFileService {
  create(data: ClientFileCreateRequest, userId: string): Promise<ClientFileDTO>;

  updateIdentity(
    id: string,
    userId: string,
    data: ClientFileIdentityRequest
  ): Promise<void>;
  updateAddress(
    id: string,
    userId: string,
    data: ClientFileAddressRequest
  ): Promise<void>;
  updateActivity(
    id: string,
    userId: string,
    data: ClientFileActivityRequest
  ): Promise<void>;
  updateSituation(
    id: string,
    userId: string,
    data: ClientFileSituationRequest
  ): Promise<void>;
  updateInternational(
    id: string,
    userId: string,
    data: ClientFileInternationalRequest
  ): Promise<void>;
  updateServices(
    id: string,
    userId: string,
    data: ClientFileServicesRequest
  ): Promise<void>;
  updateOperation(
    id: string,
    userId: string,
    data: ClientFileOperationRequest
  ): Promise<void>;
  updatePEP(
    id: string,
    userId: string,
    data: ClientFilePepRequest
  ): Promise<void>;
  updateCompliance(
    id: string,
    userId: string,
    data: ClientFileComplianceRequest
  ): Promise<void>;

  findById(id: string, userId: string, roles: string[]): Promise<ClientFileDTO>;
  findMyFiles(userId: string): Promise<ClientFileDTO[]>;
  findAll(userRoles: string[]): Promise<ClientFileDTO[]>;

  softDelete(id: string, userId: string, roles: string[]): Promise<void>;
  validateAsAdmin(id: string, validatorId: string): Promise<void>;
  validateAsSuperAdmin(id: string, validatorId: string): Promise<void>;
  reject(id: string, validatorId: string, reason: string): Promise<void>;
  updateFundOrigin(
    id: string,
    userId: string,
    data: ClientFileFundOriginRequest
  ): Promise<void>;

  /**
   * Liste paginée des fiches de l'utilisateur connecté
   */
  getMyPaginatedFiles(
    userId: string,
    request: ClientFileListRequest
  ): Promise<ClientFilePaginationDTO>;

  /**
   * Liste paginée + filtrée de toutes les fiches
   */
  getPaginatedAndFilteredFiles(
    request: ClientFileListRequest
  ): Promise<ClientFilePaginationDTO>;

  updateStatus(id: string, status: FileStatus): Promise<ClientFileDTO>;
}
