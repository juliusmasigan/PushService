import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';


export type NotificationDocument = Notification & Document;


@Schema({ timestamps: true })
export class Notification {
    // @Prop()
    // id: MongooseSchema.Types.ObjectId;

    @Prop({ required: true, immutable: true })
    recipient: string;

    @Prop({ required: true, immutable: true })
    sender: string;

    @Prop({ default: false })
    isRead: boolean;

    @Prop({ default: {} })
    payload: MongooseSchema.Types.Mixed;

    @Prop()
    channel: string;

    // @Prop({ default: Date.now, immutable: true })
    // createdDatetime: MongooseSchema.Types.Date;

    // @Prop()
    // modifiedDatetime: MongooseSchema.Types.Date;
}


export const NotificationSchema = SchemaFactory.createForClass(Notification);
