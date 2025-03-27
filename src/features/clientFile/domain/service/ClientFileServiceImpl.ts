/* eslint-disable no-unused-vars */
import { ClientFileCreateRequest } from '@features/clientFile/presentation/request/ClientFileCreateRequest';
import { ClientFileDTO } from '@features/clientFile/presentation/dto/ClientFileDTO';
import { ResourceNotFoundException } from '@core/exceptions/ResourceNotFoundException';
import { ValidationException } from '@core/exceptions/ValidationException';
import { ClientFileIdentityRequest } from '@features/clientFile/presentation/request/ClientFileIdentityRequest';
import { ClientFileAddressRequest } from '@features/clientFile/presentation/request/ClientFileAddressRequest';
import { ClientFileActivityRequest } from '@features/clientFile/presentation/request/ClientFileActivityRequest';
import { ClientFileSituationRequest } from '@features/clientFile/presentation/request/ClientFileSituationRequest';
import { ClientFileInternationalRequest } from '@features/clientFile/presentation/request/ClientFileInternationalRequest';
import { ClientFileServicesRequest } from '@features/clientFile/presentation/request/ClientFileServicesRequest';
import { ClientFileOperationRequest } from '@features/clientFile/presentation/request/ClientFileOperationRequest';
import { ClientFilePepRequest } from '@features/clientFile/presentation/request/ClientFilePepRequest';
import { ClientFileComplianceRequest } from '@features/clientFile/presentation/request/ClientFileComplianceRequest';
import { ClientFileService } from './ClientFileService';
import { ClientFileDAO } from '@features/clientFile/data/dao/ClientFileDAO';
import { toClientFileDTO } from '@features/clientFile/presentation/mapper/ClientFileMapper';
import { ClientFileEntity } from '@features/clientFile/data/entity/ClientFileEntity';
import { ClientFileFundOriginRequest } from '@features/clientFile/presentation/request/ClientFileFundOriginRequest';
import { UserDAO } from '@features/auth/data/dao/UserDAO';
import { NotificationService } from '@features/notification/domain/service/NotificationService';

export class ClientFileServiceImpl implements ClientFileService {
  constructor(
    private readonly dao: ClientFileDAO,
    private readonly userDAO: UserDAO,
    private readonly notificationService: NotificationService
  ) {}

  async create(
    data: ClientFileCreateRequest,
    userId: string
  ): Promise<ClientFileDTO> {
    const file = await this.dao.create(data, userId);

    const admins = await this.userDAO.findAllByRoles(['ADMIN', 'SUPER_ADMIN']);

    await this.notificationService.notifyMany(
      admins.map((a) => a.id),
      'CLIENT_FILE_CREATED',
      'Nouvelle fiche client',
      `Référence : ${file.reference}`
    );
    return toClientFileDTO(file);
  }

  private async checkAccess(
    id: string,
    userId: string,
    roles: string[]
  ): Promise<ClientFileEntity> {
    const file = await this.dao.findById(id);
    if (!file) throw new ResourceNotFoundException('Fiche non trouvée');

    if (!file.canBeEditedBy(userId, roles)) {
      throw new ValidationException(
        'Modification non autorisée pour ce statut ou ce rôle'
      );
    }

    return file;
  }

  async updateIdentity(
    id: string,
    userId: string,
    data: ClientFileIdentityRequest
  ): Promise<void> {
    const file = await this.checkAccess(id, userId, []);
    await this.dao.updateIdentity(file.id, data);
  }

  async updateAddress(
    id: string,
    userId: string,
    data: ClientFileAddressRequest
  ): Promise<void> {
    const file = await this.checkAccess(id, userId, []);
    await this.dao.updateAddress(file.id, data);
  }

  async updateActivity(
    id: string,
    userId: string,
    data: ClientFileActivityRequest
  ): Promise<void> {
    const file = await this.checkAccess(id, userId, []);
    await this.dao.updateActivity(file.id, data);
  }

  async updateSituation(
    id: string,
    userId: string,
    data: ClientFileSituationRequest
  ): Promise<void> {
    const file = await this.checkAccess(id, userId, []);
    await this.dao.updateSituation(file.id, data);
  }

  async updateInternational(
    id: string,
    userId: string,
    data: ClientFileInternationalRequest
  ): Promise<void> {
    const file = await this.checkAccess(id, userId, []);
    await this.dao.updateInternational(file.id, data);
  }

  async updateServices(
    id: string,
    userId: string,
    data: ClientFileServicesRequest
  ): Promise<void> {
    const file = await this.checkAccess(id, userId, []);
    await this.dao.updateServices(file.id, data);
  }

  async updateOperation(
    id: string,
    userId: string,
    data: ClientFileOperationRequest
  ): Promise<void> {
    const file = await this.checkAccess(id, userId, []);
    await this.dao.updateOperation(file.id, data);
  }

  async updatePEP(
    id: string,
    userId: string,
    data: ClientFilePepRequest
  ): Promise<void> {
    const file = await this.checkAccess(id, userId, []);
    await this.dao.updatePEP(file.id, data);
  }

  async updateCompliance(
    id: string,
    userId: string,
    data: ClientFileComplianceRequest
  ): Promise<void> {
    const file = await this.checkAccess(id, userId, []);
    await this.dao.updateCompliance(file.id, data);
  }

  async findById(
    id: string,
    userId: string,
    roles: string[]
  ): Promise<ClientFileDTO> {
    const file = await this.dao.findById(id);
    if (!file) throw new ResourceNotFoundException('Fiche introuvable');

    const isSuperAdmin = roles.includes('SUPER_ADMIN');
    const isAdmin = roles.includes('ADMIN');

    if (file.creatorId !== userId && !isAdmin && !isSuperAdmin) {
      throw new ValidationException('Accès interdit à cette fiche');
    }

    return toClientFileDTO(file);
  }

  async findMyFiles(userId: string): Promise<ClientFileDTO[]> {
    const list = await this.dao.findByCreator(userId);
    return list.map(toClientFileDTO);
  }

  async findAll(roles: string[]): Promise<ClientFileDTO[]> {
    const isAdmin = roles.includes('ADMIN') || roles.includes('SUPER_ADMIN');
    if (!isAdmin) throw new ValidationException('Accès refusé');

    const list = await this.dao.findAll();
    return list.map(toClientFileDTO);
  }

  async softDelete(id: string, userId: string, roles: string[]): Promise<void> {
    const file = await this.dao.findById(id);
    if (!file) throw new ResourceNotFoundException('Fiche introuvable');

    if (!file.canBeDeletedBy(userId, roles)) {
      throw new ValidationException('Suppression non autorisée');
    }

    await this.dao.softDelete(id);
  }

  async validateAsAdmin(id: string, validatorId: string): Promise<void> {
    const file = await this.dao.findById(id);
    if (!file || file.status !== 'AWAITING_ADMIN_VALIDATION') {
      throw new ValidationException(
        'Statut incompatible pour validation admin'
      );
    }

    await this.dao.validateByAdmin(id, validatorId);
  }

  async validateAsSuperAdmin(id: string, validatorId: string): Promise<void> {
    const file = await this.dao.findById(id);
    if (!file || file.status !== 'AWAITING_SUPERADMIN_VALIDATION') {
      throw new ValidationException(
        'Statut incompatible pour validation super admin'
      );
    }

    await this.dao.validateBySuperAdmin(id, validatorId);
  }

  async reject(id: string, validatorId: string, reason: string): Promise<void> {
    const file = await this.dao.findById(id);
    if (!file || file.status === 'VALIDATED') {
      throw new ValidationException('Impossible de rejeter cette fiche');
    }

    await this.dao.reject(id, reason);
  }

  async updateFundOrigin(
    id: string,
    userId: string,
    data: ClientFileFundOriginRequest
  ): Promise<void> {
    const file = await this.checkAccess(id, userId, []);
    await this.dao.updateFundOrigin(file.id, data);
  }
}
