export interface Instructor {
  name: string;
  surname: string;
  avatar: string;
}

interface Mobile {
  start_time: string;
}

interface Places {
  booked: number;
  total: number;
}

export interface BookingInfo {
  places: Places;
  available: boolean;
  too_soon: boolean;
  too_late: boolean;
  sold_out: boolean;
}

export interface Event {
  hour: Date;
  end: Date;
  start: Date;
  activity_name: string;
  color: string;
  room: string;
  booking_info: BookingInfo;
  instructors: Instructor[];
  mobile: Mobile;
  duration: number;
  session_id: number;
}
