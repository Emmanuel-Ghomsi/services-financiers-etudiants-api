/* eslint-disable no-unused-vars */
import { PrismaClient, RoleEnum, UserStatus } from '@prisma/client';
import { UserDAO } from './UserDAO';
import { UserEntity } from '../entity/UserEntity';
import { RegisterRequest } from '../../presentation/payload/RegisterRequest';
import { v4 as uuidv4 } from 'uuid';
import { addHours } from 'date-fns';
import { AdminUpdateUserRequest } from '@features/auth/presentation/payload/AdminUpdateUserRequest';

export class UserDAOImpl implements UserDAO {
  constructor(private readonly prisma: PrismaClient) {}

  async createUser(
    data: RegisterRequest & {
      firstLoginToken: string;
      firstLoginExpiry: Date;
    }
  ): Promise<UserEntity> {
    // Vérifie si le username existe déjà
    const existingUser = await this.prisma.user.findUnique({
      where: { username: data.username },
    });

    if (existingUser) {
      throw new Error(
        `Un utilisateur avec le nom « ${data.username} » existe déjà.`
      );
    }

    // Création du nouvel utilisateur
    const createdUser = await this.prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: 'placeholder', // Mot de passe temporaire
        firstname: '',
        lastname: '',
        phone: '',
        address: '',
        emailVerified: false,
        status: 'ACTIVE',
        firstLoginToken: data.firstLoginToken,
        firstLoginExpiry: data.firstLoginExpiry,
        roles: {
          create: data.roles.map((roleName) => ({
            role: {
              connect: { name: roleName },
            },
          })),
        },
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    // Mapping en UserEntity
    return new UserEntity({
      ...createdUser,
      roles: createdUser.roles.map((r) => r.role.name),
    });
  }

  async findByFirstLoginToken(token: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: { firstLoginToken: token },
    });
    if (!user) return null;
    return new UserEntity({
      ...user,
      roles: [], // ou charger les rôles si nécessaire
    });
  }

  async setPasswordAndClearToken(
    userId: string,
    password: string
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password,
        emailVerified: true,
        firstLoginToken: null,
        firstLoginExpiry: null,
      },
    });
  }

  async findByUsernameOrEmail(
    usernameOrEmail: string
  ): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
      include: {
        roles: { include: { role: true } },
      },
    });

    if (!user) return null;

    return new UserEntity({
      ...user,
      roles: user.roles.map((r) => r.role.name),
    });
  }

  async saveRefreshToken(
    userId: string,
    token: string,
    expiresAt: Date
  ): Promise<void> {
    await this.prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt,
        revoked: false,
      },
    });
  }

  async findRefreshToken(token: string) {
    return this.prisma.refreshToken.findUnique({ where: { token } });
  }

  async revokeRefreshToken(token: string): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { token },
      data: { revoked: true },
    });
  }

  async findById(userId: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: { include: { role: true } },
      },
    });
    if (!user) return null;
    return new UserEntity({
      ...user,
      roles: user.roles.map((r) => r.role.name),
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return new UserEntity({ ...user, roles: [] });
  }

  async findByResetToken(token: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: { resetToken: token },
    });
    if (!user) return null;
    return new UserEntity({ ...user, roles: [] });
  }

  async setResetToken(
    userId: string,
    token: string,
    expiry: Date
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        resetToken: token,
        resetTokenExpiry: expiry,
      },
    });
  }

  async setPasswordAndClearResetToken(
    userId: string,
    password: string
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password,
        emailVerified: true,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
  }

  async updatePassword(
    userId: string,
    newHashedPassword: string
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: newHashedPassword },
    });
  }

  async findPaginated({
    skip,
    take,
    where,
  }: {
    skip: number;
    take: number;
    where: any;
  }): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({
      skip,
      take,
      where,
      orderBy: { createdAt: 'desc' },
      include: { roles: { include: { role: true } } },
    });

    return users.map(
      (user) =>
        new UserEntity({
          ...user,
          roles: user.roles.map((r) => r.role.name),
        })
    );
  }

  async count(where: any): Promise<number> {
    return this.prisma.user.count({ where });
  }

  async updateUser(id: string, data: Partial<UserEntity>): Promise<UserEntity> {
    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        firstname: data.firstname,
        lastname: data.lastname,
        phone: data.phone,
        address: data.address,
        updatedAt: new Date(),
      },
      include: { roles: { include: { role: true } } },
    });

    return new UserEntity({
      ...updated,
      roles: updated.roles.map((r) => r.role.name),
    });
  }

  async softDeleteUser(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async updateStatus(id: string, status: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: {
        status: status as UserStatus,
      },
    });
  }

  async addRoleToUser(userId: string, roleName: string): Promise<UserEntity> {
    await this.prisma.userToRole.create({
      data: {
        user: { connect: { id: userId } },
        role: { connect: { name: roleName as RoleEnum } },
      },
    });

    return (await this.findById(userId)) as UserEntity;
  }

  async updateProfilePicture(
    userId: string,
    profilePicturePath: string
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { profilePicture: profilePicturePath },
    });
  }

  async findAllByRoles(roles: string[]): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({
      where: {
        roles: {
          some: {
            role: {
              name: { in: roles as RoleEnum[] },
            },
          },
        },
      },
      include: {
        roles: { include: { role: true } },
      },
    });

    return users.map(
      (user) =>
        new UserEntity({
          ...user,
          roles: user.roles.map((r) => r.role.name),
        })
    );
  }

  async resendFirstLoginToken(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { roles: { include: { role: true } } },
    });

    if (!user) return null;

    // Génère un nouveau token
    const token = uuidv4();
    const expiry = addHours(new Date(), 24);

    await this.prisma.user.update({
      where: { email },
      data: {
        firstLoginToken: token,
        firstLoginExpiry: expiry,
      },
    });

    return new UserEntity({
      ...user,
      firstLoginToken: token,
      firstLoginExpiry: expiry,
      roles: user.roles.map((r) => r.role.name),
    });
  }

  async adminUpdateUser(
    userId: string,
    data: AdminUpdateUserRequest
  ): Promise<UserEntity> {
    const updatedUser = await this.prisma.user.update({
      where: {
        id: userId,
        OR: [{ firstLoginToken: { not: null } }, { emailVerified: false }],
      },
      data: {
        username: data.username,
        email: data.email,
        roles: {
          deleteMany: {},
          create: data.roles.map((role) => ({
            role: { connect: { name: role } },
          })),
        },
      },
      include: {
        roles: { include: { role: true } },
      },
    });

    return new UserEntity({
      ...updatedUser,
      roles: updatedUser.roles.map((r) => r.role.name),
    });
  }

  async removeRolesFromUser(
    userId: string,
    roleNames: string[]
  ): Promise<void> {
    await this.prisma.userToRole.deleteMany({
      where: {
        userId,
        role: { name: { in: roleNames as RoleEnum[] } },
      },
    });
  }
}
