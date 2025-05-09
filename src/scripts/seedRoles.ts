import { PrismaClient, RoleEnum } from '@prisma/client';

const prisma = new PrismaClient();

export const seedUserRoles = async () => {
  const existingRoles = await prisma.userRole.findMany();
  const existingRoleNames = new Set(existingRoles.map((r) => r.name));

  const rolesToCreate = Object.values(RoleEnum).filter(
    (role) => !existingRoleNames.has(role)
  );

  for (const role of rolesToCreate) {
    await prisma.userRole.create({ data: { name: role } });
  }
};
