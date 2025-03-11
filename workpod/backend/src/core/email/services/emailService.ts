import { NotificationType, NotificationData } from '@/shared/types/notification.types';
import * as fs from 'fs/promises';
import * as path from 'path';
import { AppError, ErrorType } from '../../../shared/errors';

export class EmailService {
  private async getTemplate(type: NotificationType): Promise<string> {
    const templateMap: Record<NotificationType, string> = {
      BOOKING_CONFIRMED: 'booking/confirmed.html',
      BOOKING_CANCELLED: 'booking/cancelled.html',
      PAYMENT_SUCCESSFUL: 'payment/success.html',
      PAYMENT_FAILED: 'payment/failed.html',
      ACCESS_CODE_GENERATED: 'access/code-generated.html',
      POD_MAINTENANCE: 'pod/maintenance.html'
    };

    const templatePath = path.join(__dirname, '../templates', templateMap[type]);
    return fs.readFile(templatePath, 'utf-8');
  }

  async sendEmail(to: string, type: NotificationType, data: any) {
    try {
      const template = await this.getTemplate(type);
      const content = this.compileTemplate(template, data);
      
      console.log(`Sending ${type} email to ${to} with content:`, content);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new AppError('Failed to send email', 500, ErrorType.EMAIL);
    }
  }

  async handleNotification(payload: NotificationData) {
    try {
      const template = this.getTemplateForNotification(payload.type as NotificationType);
      const content = this.compileTemplate(template, payload.data);
      
      console.log('Sending notification:', content);
      return true;
    } catch (error) {
      console.error('Failed to send notification:', error);
      return false;
    }
  }

  private getTemplateForNotification(type: NotificationType): string {
    const templates: Record<NotificationType, string> = {
      PAYMENT_SUCCESSFUL: 'payment/success',
      PAYMENT_FAILED: 'payment/failed',
      BOOKING_CONFIRMED: 'booking/confirmed',
      BOOKING_CANCELLED: 'booking/cancelled',
      ACCESS_CODE_GENERATED: 'access/code-generated',
      POD_MAINTENANCE: 'pod/maintenance'
    };
    return templates[type] || 'default';
  }

  private compileTemplate(template: string, data: any): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] || '');
  }
}

export const emailService = new EmailService(); 