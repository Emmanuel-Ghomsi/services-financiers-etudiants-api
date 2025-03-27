/**
 * Data Transfer Object pour exposer les données utilisateur côté frontend.
 */
export interface UserDTO {
  id: string;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  address: string;
  profilePicture?: string | null;
  roles: string[];
  status: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
