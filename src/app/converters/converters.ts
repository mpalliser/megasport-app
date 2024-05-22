import { BookingInfo, Event, Instructor } from '../models/event'
import { AvailabilityTypeEnum, EventDto } from '../models/event-dto'

const IMG_URL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPyGNr2qL63Sfugk2Z1-KBEwMGOfycBribew&s'

function defaultAvatar(instructor: Instructor): Instructor {
  return instructor.avatar.startsWith('http')
    ? instructor
    : { ...instructor, avatar: IMG_URL }
}

function findAvailabilityType(bookingInfo: BookingInfo): AvailabilityTypeEnum {
  if (bookingInfo.too_soon) {
    return AvailabilityTypeEnum.TOO_SOON
  }
  if (bookingInfo.too_late) {
    return AvailabilityTypeEnum.TOO_LATE
  }
  if (bookingInfo.sold_out) {
    return AvailabilityTypeEnum.SOLD_OUT
  }
  return AvailabilityTypeEnum.AVAILABLE
}

export function eventToDto(event: Event): EventDto {
  return {
    hour: new Date(event.hour),
    end: new Date(event.end),
    start: new Date(event.start),
    activityName: event.activity_name.includes('Megacross') ? event.activity_name.replace(/Megacross/, '') : event.activity_name,
    color: event.color,
    room: event.room,
    bookedPlaces: event.booking_info?.places.booked,
    available: event.booking_info?.available,
    ...event.booking_info && { availabilityType: findAvailabilityType(event.booking_info) },
    totalPlaces: event.booking_info?.places.total,
    startTime: event.mobile?.start_time,
    instructor: event.instructors
      ? defaultAvatar(event.instructors[0])
      : { name: '', surname: '', avatar: IMG_URL },
    duration: event.duration,
    sessionId: event.session_id,
  }
}
