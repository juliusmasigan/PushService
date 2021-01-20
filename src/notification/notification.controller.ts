import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationDto, NotificationQueryDto } from './dto/notification.dto';
import { TransformQueryPipe } from './pipes/transform-query.pipe';
import { NotificationGateway } from './notification.gateway';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Notification } from './schemas/notification.schema';

@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private notificationGateway: NotificationGateway,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  async listNotification(@Request() request, @Query(TransformQueryPipe) params: Partial<NotificationQueryDto>) {
    return await this.notificationService.list({ ...params, user: request.user });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getNotification(@Request() request, @Param('id') id: string) {
    return await this.notificationService.get(id, request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createNotification(@Body(new ValidationPipe()) notification: NotificationDto) {
    if (notification.persist !== false) {
      const documents: Notification[] = await this.notificationService.create(notification);
      documents.forEach(async (document: Notification & { _id: any }) => {
        await this.notificationGateway.send(document.recipient, document.sender, document.payload, document._id);
      });
    } else {
      notification.recipients.forEach(async (recipient) => {
        await this.notificationGateway.send(recipient, notification.sender, notification.payload);
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/read')
  async markNotificationRead(@Request() request, @Param('id') id: string) {
    return await this.notificationService.update(id, { isRead: true }, request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async removeNotification(@Request() request, @Param('id') id: string) {
    return await this.notificationService.remove(id, request.user);
  }
}
