import {
  Component, OnDestroy, OnInit, inject,
} from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatSelectModule } from '@angular/material/select'
import { Subject, map, takeUntil } from 'rxjs'
import { EventsService } from 'src/app/services/events.service'

@Component({
  selector: 'app-form-rooms',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './form-rooms.component.html',
})
export class FormRoomsComponent implements OnInit, OnDestroy {
  public readonly eventsService = inject(EventsService)

  public readonly roomsFormControl = new FormControl<string[]>(this.eventsService.selectedFilters.rooms, { nonNullable: true })

  private readonly destroy$ = new Subject<void>()

  get roomOptions(): string[] {
    return this.eventsService.filterOptions.rooms
  }

  ngOnInit(): void {
    this.roomsFormControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        map((rooms: string[]) => rooms),
      ).subscribe((rooms: string[]) => this.eventsService.onRoomChanges(rooms))
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  clearValue(event: Event): void {
    event.stopPropagation()
    this.roomsFormControl.setValue([])
  }
}
