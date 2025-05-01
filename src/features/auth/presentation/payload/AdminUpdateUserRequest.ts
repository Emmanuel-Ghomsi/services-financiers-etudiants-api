import { z } from 'zod';
import { RoleEnum } from '@prisma/client';

export const AdminUpdateUserRequestSchema = z.object({
  username: z.string().min(3, 'Le username est obligatoire'),
  email: z.string().email('Email invalide'),
  roles: z.array(z.nativeEnum(RoleEnum)).min(1, 'Au moins un rôle requis'),
});

export type AdminUpdateUserRequest = z.infer<
  typeof AdminUpdateUserRequestSchema
>;
