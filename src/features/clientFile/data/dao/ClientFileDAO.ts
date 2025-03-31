/* eslint-disable no-unused-vars */
import { ClientFileCreateRequest } from '@features/clientFile/presentation/request/ClientFileCreateRequest';
import { ClientFileEntity } from '../entity/ClientFileEntity';
import { ClientFileIdentityRequest } from '@features/clientFile/presentation/request/ClientFileIdentityRequest';
import { ClientFileAddressRequest } from '@features/clientFile/presentation/request/ClientFileAddressRequest';
import { ClientFileActivityRequest } from '@features/clientFile/presentation/request/ClientFileActivityRequest';
import { ClientFileSituationRequest } from '@features/clientFile/presentation/request/ClientFileSituationRequest';
import { ClientFileInternationalRequest } from '@features/clientFile/presentation/request/ClientFileInternationalRequest';
import { ClientFileServicesRequest } from '@features/clientFile/presentation/request/ClientFileServicesRequest';
import { ClientFileOperationRequest } from '@features/clientFile/presentation/request/ClientFileOperationRequest';
import { ClientFilePepRequest } from '@features/clientFile/presentation/request/ClientFilePepRequest';
import { ClientFileComplianceRequest } from '@features/clientFile/presentation/request/ClientFileComplianceRequest';
import { ClientFileFundOriginRequest } from '@features/clientFile/presentation/request/ClientFileFundOriginRequest';
import { ClientFileListRequest } from '@features/clientFile/presentation/request/ClientFileListRequest';

export interface ClientFileDAO {
  create(
    data: ClientFileCreateRequest,
    creatorId: string
  ): Promise<ClientFileEntity>;

  updateIdentity(
    fileId: string,
    data: ClientFileIdentityRequest
  ): Promise<void>;
  updateAddress(fileId: string, data: ClientFileAddressRequest): Promise<void>;
  updateActivity(
    fileId: string,
    data: ClientFileActivityRequest
  ): Promise<void>;
  updateSituation(
    fileId: string,
    data: ClientFileSituationRequest
  ): Promise<void>;
  updateInternational(
    fileId: string,
    data: ClientFileInternationalRequest
  ): Promise<void>;
  updateServices(
    fileId: string,
    data: ClientFileServicesRequest
  ): Promise<void>;
  updateOperation(
    fileId: string,
    data: ClientFileOperationRequest
  ): Promise<void>;
  updatePEP(fileId: string, data: ClientFilePepRequest): Promise<void>;
  updateCompliance(
    fileId: string,
    data: ClientFileComplianceRequest
  ): Promise<void>;

  findById(fileId: string): Promise<ClientFileEntity | null>;
  findByCreator(userId: string): Promise<ClientFileEntity[]>;
  findAll(): Promise<ClientFileEntity[]>;

  softDelete(fileId: string): Promise<void>;

  validateByAdmin(fileId: string, validatorId: string): Promise<void>;
  validateBySuperAdmin(fileId: string, validatorId: string): Promise<void>;
  reject(fileId: string, reason: string): Promise<void>;
  updateFundOrigin(
    fileId: string,
    data: ClientFileFundOriginRequest
  ): Promise<void>;

  getPaginatedByUserId(
    userId: string,
    request: ClientFileListRequest
  ): Promise<{
    items: ClientFileEntity[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    pageLimit: number;
  }>;

  getPaginatedAndFiltered(request: ClientFileListRequest): Promise<{
    items: ClientFileEntity[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    pageLimit: number;
  }>;
}
