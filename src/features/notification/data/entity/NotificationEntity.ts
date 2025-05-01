export class NotificationEntity {
  id!: string;
  type!: string;
  title!: string;
  message!: string;
  userId!: string;
  isRead!: boolean;
  createdAt!: Date;
  targetUrl?: string;

  constructor(props: Partial<NotificationEntity>) {
    Object.assign(this, props);
  }
}
