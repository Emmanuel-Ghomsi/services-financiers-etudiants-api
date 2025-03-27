/* eslint-disable no-unused-vars */
import { PrismaClient, RoleEnum, UserStatus } from '@prisma/client';
import { UserDAO } from './UserDAO';
import { UserEntity } from '../entity/UserEntity';
import { RegisterRequest } from '../../presentation/request/RegisterRequest';

export class UserDAOImpl implements UserDAO {
  constructor(private readonly prisma: PrismaClient) {}

  async createUser(
    data: RegisterRequest & {
      firstLoginToken: string;
      firstLoginExpiry: Date;
    }
  ): Promise<UserEntity> {
    const created = await this.prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: 'placeholder', // temporairement, mot de passe vide
        firstname: '',
        lastname: '',
        phone: '',
        address: '',
        emailVerified: false,
        status: 'ACTIVE',
        firstLoginToken: data.firstLoginToken,
        firstLoginExpiry: data.firstLoginExpiry,
        roles: {
          create: data.roles.map((role) => ({
            role: {
              connect: { name: role },
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

    return new UserEntity({
      ...created,
      roles: created.roles.map((r) => r.role.name),
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

  async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({
      include: { roles: { include: { role: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return users.map(
      (user) =>
        new UserEntity({
          ...user,
          roles: user.roles.map((r) => r.role.name),
        })
    );
  }

  async updateUser(id: string, data: Partial<UserEntity>): Promise<UserEntity> {
    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        firstname: data.firstname,
        lastname: data.lastname,
        phone: data.phone,
        address: data.address,
        profilePicture: data.profilePicture,
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

  async updateProfilePicture(userId: string, url: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { profilePicture: url },
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
}
