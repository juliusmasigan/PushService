import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { NotificationQueryDto } from '../dto/notification.dto';


@Injectable()
export class TransformQueryPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): NotificationQueryDto {
        if (value.is_read !== undefined) {
            value.isRead = value.is_read;
            delete value.is_read;
        }

        return value;
    }
}
