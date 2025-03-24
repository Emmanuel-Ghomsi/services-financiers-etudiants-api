import { UserStatus } from '@prisma/client';

/**
 * Représente une entité utilisateur dans le domaine métier.
 * Ne dépend pas du client Prisma directement.
 */
export class UserEntity {
  id!: string;
  username!: string;
  email!: string;
  password!: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  address?: string;
  status!: UserStatus;
  roles!: string[];
  emailVerified!: boolean;
  firstLoginToken?: string | null;
  firstLoginExpiry?: Date | null;
  resetToken?: string | null;
  resetTokenExpiry?: Date | null;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date | null;

  /**
   * Constructeur de l'entité utilisateur
   * @param props Propriétés nécessaires à l'instanciation
   */
  constructor(props: Partial<UserEntity>) {
    Object.assign(this, props);
  }

  /**
   * Vérifie si l'utilisateur a un rôle donné
   * @param role Rôle à vérifier
   * @returns true si l'utilisateur a le rôle
   */
  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }

  /**
   * Vérifie si le compte utilisateur est actif
   */
  isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  /**
   * Vérifie si le compte est vérifié par email
   */
  isVerified(): boolean {
    return this.emailVerified;
  }
}
