import { EventDto } from './event-dto'

export interface EventDataSource {
  hour: string;
  [key: string]: EventDto[] | string | boolean;
}
