/* eslint-disable no-unused-vars */
import { FileStatus, PrismaClient } from '@prisma/client';
import { ClientFileDAO } from './ClientFileDAO';
import { ClientFileEntity } from '../entity/ClientFileEntity';
import { ClientFileCreateRequest } from '@features/clientFile/presentation/payload/ClientFileCreateRequest';
import { ClientFileIdentityRequest } from '@features/clientFile/presentation/payload/ClientFileIdentityRequest';
import { ClientFileAddressRequest } from '@features/clientFile/presentation/payload/ClientFileAddressRequest';
import { ClientFileActivityRequest } from '@features/clientFile/presentation/payload/ClientFileActivityRequest';
import { ClientFileSituationRequest } from '@features/clientFile/presentation/payload/ClientFileSituationRequest';
import { ClientFileInternationalRequest } from '@features/clientFile/presentation/payload/ClientFileInternationalRequest';
import { ClientFileServicesRequest } from '@features/clientFile/presentation/payload/ClientFileServicesRequest';
import { ClientFileOperationRequest } from '@features/clientFile/presentation/payload/ClientFileOperationRequest';
import { ClientFilePepRequest } from '@features/clientFile/presentation/payload/ClientFilePepRequest';
import { ClientFileComplianceRequest } from '@features/clientFile/presentation/payload/ClientFileComplianceRequest';
import { ClientFileFundOriginRequest } from '@features/clientFile/presentation/payload/ClientFileFundOriginRequest';
import { ClientFileListRequest } from '@features/clientFile/presentation/payload/ClientFileListRequest';
import { generateClientCode, generateClientReference } from '@core/utils/utils';

export class ClientFileDAOImpl implements ClientFileDAO {
  constructor(private prisma: PrismaClient) {}

  async create(
    data: ClientFileCreateRequest,
    creatorId: string
  ): Promise<ClientFileEntity> {
    const reference = await this.generateUniqueReference();
    const clientCode = await this.generateUniqueClientCode();

    const created = await this.prisma.clientFile.create({
      data: {
        ...data,
        reference,
        clientCode,
        status: 'IN_PROGRESS',
        creatorId,
      },
    });
    return new ClientFileEntity(created);
  }

  private async update(fileId: string, data: Partial<any>) {
    await this.prisma.clientFile.update({
      where: { id: fileId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async updateIdentity(
    fileId: string,
    data: ClientFileIdentityRequest
  ): Promise<void> {
    await this.update(fileId, data);
  }

  async updateAddress(
    fileId: string,
    data: ClientFileAddressRequest
  ): Promise<void> {
    await this.update(fileId, data);
  }

  async updateActivity(
    fileId: string,
    data: ClientFileActivityRequest
  ): Promise<void> {
    await this.update(fileId, data);
  }

  async updateSituation(
    fileId: string,
    data: ClientFileSituationRequest
  ): Promise<void> {
    await this.update(fileId, data);
  }

  async updateInternational(
    fileId: string,
    data: ClientFileInternationalRequest
  ): Promise<void> {
    await this.update(fileId, data);
  }

  async updateServices(
    fileId: string,
    data: ClientFileServicesRequest
  ): Promise<void> {
    await this.update(fileId, data);
  }

  async updateOperation(
    fileId: string,
    data: ClientFileOperationRequest
  ): Promise<void> {
    await this.update(fileId, data);
  }

  async updatePEP(fileId: string, data: ClientFilePepRequest): Promise<void> {
    await this.update(fileId, data);
  }

  async updateCompliance(
    fileId: string,
    data: ClientFileComplianceRequest
  ): Promise<void> {
    await this.update(fileId, data);
  }

  async findById(fileId: string): Promise<ClientFileEntity | null> {
    const file = await this.prisma.clientFile.findUnique({
      where: { id: fileId },
      include: {
        creator: {
          select: {
            username: true,
          },
        },
      },
    });
    return file ? new ClientFileEntity(file) : null;
  }

  async findByCreator(userId: string): Promise<ClientFileEntity[]> {
    const list = await this.prisma.clientFile.findMany({
      where: { creatorId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        creator: {
          select: {
            username: true,
          },
        },
      },
    });
    return list.map((f) => new ClientFileEntity(f));
  }

  async findAll(): Promise<ClientFileEntity[]> {
    const list = await this.prisma.clientFile.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        creator: {
          select: {
            username: true,
          },
        },
      },
    });
    return list.map((f) => new ClientFileEntity(f));
  }

  async softDelete(fileId: string): Promise<void> {
    await this.prisma.clientFile.update({
      where: { id: fileId },
      data: { deletedAt: new Date() },
    });
  }

  async validateByAdmin(fileId: string, validatorId: string): Promise<void> {
    await this.prisma.clientFile.update({
      where: { id: fileId },
      data: {
        validatorAdminId: validatorId,
        validationDateAdmin: new Date(),
        status: 'AWAITING_SUPERADMIN_VALIDATION',
      },
    });
  }

  async validateBySuperAdmin(
    fileId: string,
    validatorId: string
  ): Promise<void> {
    await this.prisma.clientFile.update({
      where: { id: fileId },
      data: {
        validatorSuperAdminId: validatorId,
        validationDateSuper: new Date(),
        status: 'VALIDATED',
      },
    });
  }

  async reject(fileId: string, reason: string): Promise<void> {
    await this.prisma.clientFile.update({
      where: { id: fileId },
      data: {
        status: 'REJECTED',
        rejectionReason: reason,
      },
    });
  }

  async updateFundOrigin(
    fileId: string,
    data: ClientFileFundOriginRequest
  ): Promise<void> {
    await this.update(fileId, data);
  }

  async getPaginatedByUserId(
    userId: string,
    request: ClientFileListRequest
  ): Promise<{
    items: ClientFileEntity[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    pageLimit: number;
  }> {
    const { page = 1, pageSize = 10, pageLimit = 10 } = request;
    const skip = (page - 1) * pageSize;

    const [items, totalItems] = await Promise.all([
      this.prisma.clientFile.findMany({
        include: {
          creator: {
            select: {
              username: true,
            },
          },
        },
        where: { creatorId: userId },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.clientFile.count({ where: { creatorId: userId } }),
    ]);

    return {
      items: items.map(
        (item) =>
          new ClientFileEntity({
            ...item,
            creatorUsername: item.creator?.username,
          })
      ),
      totalItems,
      currentPage: page,
      totalPages: Math.ceil(totalItems / pageSize),
      pageSize,
      pageLimit,
    };
  }

  async getPaginatedAndFiltered(request: ClientFileListRequest): Promise<{
    items: ClientFileEntity[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    pageLimit: number;
  }> {
    const { page = 1, pageSize = 10, pageLimit = 10, filters = {} } = request;
    const skip = (page - 1) * pageSize;

    const where: any = {};

    if (filters.reference) {
      where.reference = { contains: filters.reference, mode: 'insensitive' };
    }
    if (filters.lastName) {
      where.lastName = { contains: filters.lastName, mode: 'insensitive' };
    }
    if (filters.clientCode) {
      where.clientCode = { contains: filters.clientCode, mode: 'insensitive' };
    }
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.email) {
      where.email = { contains: filters.email, mode: 'insensitive' };
    }

    const [items, totalItems] = await Promise.all([
      this.prisma.clientFile.findMany({
        include: {
          creator: {
            select: {
              username: true,
            },
          },
        },
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.clientFile.count({ where }),
    ]);

    return {
      items: items.map(
        (item) =>
          new ClientFileEntity({
            ...item,
            creatorUsername: item.creator?.username,
          })
      ),
      totalItems,
      currentPage: page,
      totalPages: Math.ceil(totalItems / pageSize),
      pageSize,
      pageLimit,
    };
  }

  async updateStatus(
    id: string,
    status: FileStatus
  ): Promise<ClientFileEntity> {
    const updated = await this.prisma.clientFile.update({
      where: { id },
      data: { status },
    });

    return new ClientFileEntity(updated);
  }

  async generateUniqueClientCode(): Promise<string> {
    let unique = false;
    let code = '';

    while (!unique) {
      code = generateClientCode();
      const existing = await this.prisma.clientFile.findUnique({
        where: { clientCode: code },
      });
      if (!existing) unique = true;
    }

    return code;
  }

  async generateUniqueReference(): Promise<string> {
    let unique = false;
    let ref = '';

    while (!unique) {
      ref = generateClientReference();
      const existing = await this.prisma.clientFile.findUnique({
        where: { reference: ref },
      });
      if (!existing) unique = true;
    }

    return ref;
  }
}
