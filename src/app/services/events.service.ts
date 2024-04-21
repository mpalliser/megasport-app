/* eslint-disable @typescript-eslint/member-ordering */
import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { CookieService } from 'ngx-cookie-service'
import {
  BehaviorSubject, Observable, ReplaySubject, forkJoin, map,
} from 'rxjs'
import {
  YEAR, formatedDate, getMondayOfWeek, getSundayOfWeek, gmtFormat,
} from 'src/app/consts/date'
import { eventToDto } from '../converters/converters'
import { Event } from '../models/event'
import { EventDataSource } from '../models/event-data-source'
import { EventDto } from '../models/event-dto'
import { Filters } from '../models/filters'

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private readonly cookieService = inject(CookieService)

  public selectedFilters: Filters = this.cookieService?.get('filters') ? JSON.parse(this.cookieService.get('filters')) : { activities: [], rooms: [] }

  public filterOptions: Filters = { activities: [], rooms: [] }

  public hoursList: string[] = []

  private columns = new BehaviorSubject<string[]>([])

  private data: EventDto[] = [] // used for filters

  private dataSourceSubject = new ReplaySubject<EventDataSource[]>(1)

  private today = formatedDate(new Date())

  get dataSource$(): Observable<EventDataSource[]> {
    return this.dataSourceSubject.asObservable()
  }

  get columns$(): Observable<string[]> {
    return this.columns.asObservable()
  }

  private httpClient = inject(HttpClient)

  constructor() {
    this.getData()
  }

  public inscribe(event: EventDto, email: string): Observable<unknown> {
    const formData = new FormData()
    formData.append('gym_token', '667be543b02294b7624119adc3a725473df39885')
    formData.append('booking[event_session_id]', event.sessionId.toString())
    formData.append('booking[email]', email)
    formData.append('password', '123456789')

    return this.httpClient.post('https://app.gym-up.com/api/v1/bookings', formData)
  }

  public onActivitiesChanges(activities: string[]): void {
    this.selectedFilters = { ...this.selectedFilters, activities }
    this.updateFilters()
  }

  public onRoomChanges(rooms: string[]): void {
    this.selectedFilters = { ...this.selectedFilters, rooms }
    this.updateFilters()
  }

  public applyfilters({ activities, rooms }: Filters): void {
    const emptyFilters = activities?.length === 0 && rooms?.length === 0
    const filteredEvents = this.data
      .filter((event: EventDto) => emptyFilters || activities?.includes(event.activityName) || rooms?.includes(event.room))

    this.applyFiltersToTableData(filteredEvents)
  }

  private applyFiltersToTableData(data: EventDto[]): void {
    this.hoursList = this.generateHourList(data)
    const eventsByHour: EventDto[][] = this.hoursList
      .map((hour: string) => data.filter((event: EventDto) => event.startTime === hour))
      .filter((event: EventDto[]) => event.length > 0)

    this.dataSourceSubject.next(this.eventsToDataSource(eventsByHour))
  }

  private updateFilters(): void {
    this.cookieService.set('filters', JSON.stringify(this.selectedFilters), YEAR)
    this.applyfilters(this.selectedFilters)
  }

  private generateHourList(data: EventDto[]): string[] {
    const hourSet = new Set<string>(data.map((event: EventDto) => event.startTime))
    return [...hourSet.values()].sort()
  }

  private eventsToDataSource(eventsByHour: EventDto[][]): EventDataSource[] {
    return eventsByHour.map((events: EventDto[], index: number) => ({
      hour: this.hoursList[index],
      ...this.columns.value
        .filter(column => column !== 'hour')
        .reduce((accumulator: { [key: string]: EventDto[] }, day: string) => {
          accumulator[day] = events.filter((event: EventDto) => formatedDate(event.start) === day)
          return accumulator
        }, {}),
    }))
  }

  private generateFilters(events: EventDto[]): void {
    this.filterOptions = {
      activities: [...new Set(events.map((event: EventDto) => event.activityName).sort())],
      rooms: [...new Set(events.map((event: EventDto) => event.room).sort())],
    }
  }

  private getData(): void {
    forkJoin([
      this.httpClient.get<{ events: Event[] }>(this.dataUrl()),
      this.httpClient.get<{ events: Event[] }>(this.dataUrl(true)),
    ]).pipe(
      map((result: { events: Event[] }[]) => [...result[0].events, ...result[1].events].map((event: Event) => eventToDto(event))),
    ).subscribe((events: EventDto[]) => {
      this.data = events
      this.generateFilters(events)
      this.generateColumns(events)
      this.applyfilters(this.selectedFilters)
    })
  }

  private dataUrl(isNextWeek = false): string {
    const url = 'https://app.gym-up.com/ws/v2/event_sessions_public/667be543b02294b7624119adc3a725473df39885'
    const date = new Date()
    if (isNextWeek) {
      date.setDate(date.getDate() + 7)
    }
    return `${url}/timetable?start=${gmtFormat(getMondayOfWeek(date))}&end=${gmtFormat(getSundayOfWeek(date))}`
  }

  private generateColumns(events: EventDto[]): void {
    const daySet = new Set<string>(events
      .filter(({ start }) => formatedDate(start) >= this.today)
      .map((event: EventDto) => formatedDate(event.start) ?? ''))
    this.columns.next(['hour', ...daySet.values()].slice(0, 8))
  }
}
