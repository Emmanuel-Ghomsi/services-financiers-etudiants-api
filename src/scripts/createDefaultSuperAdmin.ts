import { logger } from '@core/config/logger';
import { PrismaClient, RoleEnum, UserStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const createDefaultSuperAdmin = async () => {
  // On vérifie s’il existe déjà un User avec le rôle SUPER_ADMIN
  const existing = await prisma.user.findFirst({
    where: {
      roles: {
        some: {
          role: {
            name: RoleEnum.SUPER_ADMIN,
          },
        },
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

  if (existing) {
    logger.info('✅ Super administrateur déjà existant');
    return;
  }

  // Récupérer ou créer le rôle SUPER_ADMIN
  let superAdminRole = await prisma.userRole.findUnique({
    where: { name: RoleEnum.SUPER_ADMIN },
  });

  if (!superAdminRole) {
    superAdminRole = await prisma.userRole.create({
      data: { name: RoleEnum.SUPER_ADMIN },
    });
  }

  const hashedPassword = await bcrypt.hash('Admin1234', 10);

  const newSuperAdmin = await prisma.user.create({
    data: {
      username: 'superadmin',
      email: 'superadmin@sf-e.ca',
      firstname: 'Admin',
      lastname: 'Principal',
      password: hashedPassword,
      phone: '+237600000000',
      emailVerified: true,
      address: 'Siège Central',
      status: UserStatus.ACTIVE,
      roles: {
        create: [
          {
            role: {
              connect: {
                id: superAdminRole.id,
              },
            },
          },
        ],
      },
    },
  });

  logger.info('🎉 Super administrateur créé avec succès :');
  logger.info(`➡️  Email: ${newSuperAdmin.email}`);
  logger.info(`➡️  Mot de passe: Admin1234`);
};
