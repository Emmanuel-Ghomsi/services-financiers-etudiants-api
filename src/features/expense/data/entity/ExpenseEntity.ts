import {
  ExpenseCategory,
  ExpenseCategoryGroup,
  ValidationStatus,
} from '@prisma/client';

export class ExpenseEntity {
  id!: string;
  amount!: number;
  date!: Date;
  category!: ExpenseCategory;
  group!: ExpenseCategoryGroup;
  description?: string | null;
  fileUrl?: string | null; // lien vers la pièce justificative stockée
  employeeId!: string;
  projectId?: string | null;

  status!: ValidationStatus;
  validatedByAdmin?: string | null;
  validatedBySuperAdmin?: string | null;
  rejectedReason?: string | null;
  creatorId?: string | null;

  createdAt!: Date;
  updatedAt!: Date;

  constructor(props: Partial<ExpenseEntity>) {
    Object.assign(this, props);
  }
}
