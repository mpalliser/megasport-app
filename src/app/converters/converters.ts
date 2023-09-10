import { Event } from '../models/event'
import { EventDto } from '../models/event-dto'

export const eventToDto = (event: Event): EventDto => ({
  hour: new Date(event.hour),
  end: new Date(event.end),
  start: new Date(event.start),
  activityName: event.activity_name,
  color: event.color,
  room: event.room,
  bookedPlaces: event.booking_info.places.booked,
  totalPlaces: event.booking_info.places.total,
  startTime: event.mobile.start_time,
  instructor: event.instructors ? `${event.instructors[0].name}` : '',
  duration: event.duration,
  sessionId: event.session_id,
})
