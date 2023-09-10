import { EventDto } from './event-dto'

export interface EventDataSource {
  hour: string;
  collapsed: boolean;
  [key: string]: EventDto[] | string | boolean;
}
