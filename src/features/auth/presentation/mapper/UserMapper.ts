import { UserEntity } from '../../data/entity/UserEntity';
import { UserDTO } from '../dto/UserDTO';

/**
 * Convertit une entité User en DTO.
 * @param entity L'utilisateur en tant qu'entité métier
 * @returns DTO à exposer au frontend
 */
export function toUserDTO(entity: UserEntity): UserDTO {
  return {
    id: entity.id,
    username: entity.username,
    email: entity.email,
    firstname: entity.firstname || '',
    lastname: entity.lastname || '',
    phone: entity.phone || '',
    address: entity.address || '',
    roles: entity.roles,
    status: entity.status,
    emailVerified: entity.emailVerified,
    createdAt: entity.createdAt,
  };
}

/**
 * Convertit un DTO utilisateur en entité User.
 * Utile pour reconstruction lors de modification ou mise à jour.
 */
export function fromUserDTO(dto: UserDTO): UserEntity {
  return new UserEntity({
    id: dto.id,
    username: dto.username,
    email: dto.email,
    firstname: dto.firstname,
    lastname: dto.lastname,
    phone: dto.phone,
    address: dto.address,
    roles: dto.roles,
    status: dto.status as any,
    emailVerified: dto.emailVerified,
    createdAt: dto.createdAt,
    updatedAt: new Date(),
  });
}
