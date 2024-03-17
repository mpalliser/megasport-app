import { Event, Instructor } from '../models/event'
import { EventDto } from '../models/event-dto'

function defaultAvatar(instructor: Instructor): Instructor {
  return instructor.avatar.startsWith('http')
    ? instructor
    : { ...instructor, avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPyGNr2qL63Sfugk2Z1-KBEwMGOfycBribew&s' }
}

export const eventToDto = (event: Event): EventDto => ({
  hour: new Date(event.hour),
  end: new Date(event.end),
  start: new Date(event.start),
  activityName: event.activity_name,
  color: event.color,
  room: event.room,
  bookedPlaces: event.booking_info?.places.booked,
  available: event.booking_info?.available,
  totalPlaces: event.booking_info?.places.total,
  startTime: event.mobile?.start_time,
  instructor: event.instructors
    ? defaultAvatar(event.instructors[0])
    : { name: '', surname: '', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPyGNr2qL63Sfugk2Z1-KBEwMGOfycBribew&s' },
  duration: event.duration,
  sessionId: event.session_id,
})
