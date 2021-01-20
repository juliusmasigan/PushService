import { Model, Query } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';
import { NotificationDto, NotificationQueryDto } from './dto/notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>
  ) { }

  clients: any[] = [];

  async list(params: Partial<NotificationQueryDto> & { user: any }): Promise<Notification[]> {
    // Strip the recipient from the querystring and use the user's email.
    const { user, ...args } = params;

    const query = new Query().find({ ...args, recipient: user.email });
    const result = await this.notificationModel.find(query);

    return result;
  }

  async get(id: string, user?): Promise<Notification> {
    const query = new Query().findOne({ _id: id, recipient: user.email });
    const result = await this.notificationModel.findOne(query);
    if (!result) {
      throw new NotFoundException();
    }

    return result;
  }

  async create(notification: NotificationDto): Promise<Notification[]> {
    const documents = notification.recipients.map((recipient: string) => {
      return {
        insertOne: {
          document: {
            recipient,
            sender: notification.sender,
            channel: notification.channel,
            payload: notification.payload
          }
        }
      };
    });
    this.notificationModel.bulkWrite(documents);
    const results: Notification[] = [];
    documents.forEach((doc: any) => {
      results.push(doc.insertOne.document);
    });

    return await Promise.resolve(results);
  }

  async update(id: string, notification: Partial<Notification>, user): Promise<Notification> {
    const result = this.notificationModel.findOneAndUpdate(
      { _id: id, recipient: user.email },
      notification,
      { new: true, useFindAndModify: false }
    );

    return await result;
  }

  async remove(id: string, user): Promise<Notification> {
    const result = this.notificationModel.findOneAndDelete({ _id: id, recipient: user.email });
    if (!await result) {
      throw new NotFoundException();
    }

    return await result;
  }
}
