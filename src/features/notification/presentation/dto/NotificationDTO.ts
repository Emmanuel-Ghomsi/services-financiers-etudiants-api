export interface NotificationDTO {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  targetUrl?: string | null;
}
