export interface EventDto {
  hour: Date;
  end: Date;
  start: Date;
  activityName: string;
  color: string;
  room: string;
  bookedPlaces: number;
  totalPlaces: number;
  startTime: string;
  instructor: string;
  duration: number;
  sessionId: number;
}
