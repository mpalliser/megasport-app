import { Instructor } from 'src/app/models/event'

export enum AvailabilityTypeEnum {
  TOO_SOON = 'too_soon',
  TOO_LATE = 'too_late',
  SOLD_OUT = 'sold_out',
  AVAILABLE = 'available'
}

export interface EventDto {
  hour: Date;
  end: Date;
  available: boolean;
  availabilityType: AvailabilityTypeEnum;
  start: Date;
  activityName: string;
  color: string;
  room: string;
  bookedPlaces: number;
  totalPlaces: number;
  startTime: string;
  instructor: Instructor;
  duration: number;
  sessionId: number;
}
