import { UserDTO } from '../dto/UserDTO';
import { UserEntity } from '../../data/entity/UserEntity';

/**
 * Convertit une entité métier en DTO exposé
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
    profilePicture: entity.profilePicture || null,
    roles: entity.roles,
    status: entity.status,
    emailVerified: entity.emailVerified,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
    deletedAt: entity.deletedAt || null,
  };
}

/**
 * Recrée une entité à partir d’un DTO
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
    profilePicture: dto.profilePicture,
    roles: dto.roles,
    status: dto.status as any,
    emailVerified: dto.emailVerified,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    deletedAt: dto.deletedAt,
  });
}
