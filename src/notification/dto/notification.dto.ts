import { TransformPlainToClass } from 'class-transformer';
import { IsString, IsBoolean, ValidateNested, IsNotEmpty, IsArray, MaxLength } from 'class-validator';


class Content {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(250)
    message: string;

    linkUrl?: string;
    icon?: string;
    assets?: string[];
}

export class Payload {
    @IsNotEmpty()
    @IsString()
    topic: string;

    @IsNotEmpty()
    @ValidateNested()
    content: Content;
}

export class NotificationDto {
    @IsNotEmpty()
    @IsArray()
    @IsString({
        each: true
    })
    recipients: string[];

    @IsNotEmpty()
    @IsString()
    sender: string;

    @IsNotEmpty()
    @ValidateNested()
    payload: Payload;

    @IsString()
    channel?: string;

    @IsBoolean()
    persist?: boolean = true;
}

export class NotificationQueryDto {
    recipient: string;
    sender: string;
    isRead: boolean;
}
