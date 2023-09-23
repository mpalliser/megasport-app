import { DatePipe } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { CookieService } from 'ngx-cookie-service'
import {
  BehaviorSubject,
  Observable, ReplaySubject,
  map, tap,
} from 'rxjs'
import { getMondayOfWeek, getSundayOfWeek, gmtFormat } from 'src/app/consts/date'
import { eventToDto } from '../converters/converters'
import { Event } from '../models/event'
import { EventDataSource } from '../models/event-data-source'
import { EventDto } from '../models/event-dto'
import { Filters } from '../models/filters'

// TODO: en modo movil, mostrar solo una column
// arriba debe haber un carrousel con los días
@Injectable({
  providedIn: 'root',
})
export class EventsService {
  public hoursList: string[] = []

  public columns = new BehaviorSubject<string[]>([])

  public selectedFilters: Filters = { activities: [], rooms: [] }

  public filterOptions: Filters = { activities: [], rooms: [] }

  private data: EventDto[] = [] // used for filters

  private dataSourceSubject = new ReplaySubject<EventDataSource[]>(1)

  get dataSource$(): Observable<EventDataSource[]> {
    return this.dataSourceSubject.asObservable()
  }

  constructor(private httpClient: HttpClient, public datepipe: DatePipe, private cookieService: CookieService) {
    const filters = this.cookieService.get('filters')
    if (filters) {
      this.selectedFilters = JSON.parse(filters)
    }
  }

  public getWeekData(isNextWeek = false): void {
    this.getData(isNextWeek).subscribe()
  }

  public applyfilters({ activities, rooms }: Filters): void {
    const events = this.data.filter((event: EventDto) => {
      const emptyFilters = activities?.length === 0 && rooms?.length === 0
      const matchActivity = activities?.includes(event.activityName)
      const matchRoom = rooms?.includes(event.room)
      return emptyFilters || matchActivity || matchRoom
    })

    this.defineEventsByHour(events)
  }

  public inscribe(event: EventDto, email: string): Observable<unknown> {
    const formData = new FormData()
    formData.append('gym_token', '667be543b02294b7624119adc3a725473df39885')
    formData.append('booking[event_session_id]', event.sessionId.toString())
    formData.append('booking[email]', email)
    formData.append('password', '123456789')

    return this.httpClient.post('https://app.gym-up.com/api/v1/bookings', formData)
  }

  public defineEventsByHour(data: EventDto[]): void {
    const eventsByHour: EventDto[][] = this.hoursList
      .map((hour: string) => data.filter((event: EventDto) => event.startTime === hour))
    this.defineDataSource(eventsByHour)
  }

  private setFilterOptions(events: EventDto[]): void {
    if (this.filterOptions) {
      this.filterOptions = {
        activities: [...new Set(events.map((event: EventDto) => event.activityName).sort())],
        rooms: [...new Set(events.map((event: EventDto) => event.room).sort())],
      }
    }
  }

  private getData(isNextWeek: boolean): Observable<EventDto[]> {
    return this.httpClient.get<{ events: Event[] }>(this.dataUrl(isNextWeek))
      .pipe(
        map(({ events }) => events.map((event: Event) => eventToDto(event))),
        tap((events: EventDto[]) => {
          this.setData(events)
          this.setFilterOptions(events)
          this.defineHoursList(events)
          this.defineDayColumns(events)
          this.applyfilters(this.selectedFilters)
        }),
      )
  }

  private dataUrl(isNextWeek = false): string {
    const url = 'https://app.gym-up.com/ws/v2/event_sessions_public/667be543b02294b7624119adc3a725473df39885'
    const date = new Date()
    if (isNextWeek) {
      date.setDate(date.getDate() + 7)
    }
    return `${url}/timetable?start=${gmtFormat(getMondayOfWeek(date))}&end=${gmtFormat(getSundayOfWeek(date))}`
  }

  private setData(events: EventDto[]): void {
    this.data = events
  }

  private defineDayColumns(events: EventDto[]): void {
    const daySet = new Set<string>()
    events
      .filter(() => daySet.size < 7)
      .map((event: EventDto) => daySet.add(this.datepipe.transform(event.start, 'MM-dd-yyyy') ?? ''))
    this.columns.next(['hour', ...daySet.values()])
  }

  private defineDataSource(eventsByHour: EventDto[][]): void {
    let dataSource: EventDataSource[] = []
    eventsByHour.forEach((events: EventDto[], index: number) => {
      const element: EventDataSource = { hour: this.hoursList[index], collapsed: false }
      this.columns.value.filter(column => column !== 'hour').forEach((day: string) => {
        element[day] = events.filter((event: EventDto) => this.datepipe.transform(event.start, 'MM-dd-yyyy') === day)
      })
      dataSource = [...dataSource, element]
    })

    this.dataSourceSubject.next(dataSource)
  }

  private defineHoursList(events: EventDto[]): void {
    if (!this.hoursList.length) {
      const hourSet = new Set<string>()
      events.forEach((event: EventDto) => hourSet.add(event.startTime))

      this.hoursList = [...hourSet.values()].sort()
    }
  }
}
