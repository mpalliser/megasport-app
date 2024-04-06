import {
  Component, OnDestroy, OnInit, inject,
} from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { MatIconModule } from '@angular/material/icon'
import { MatSelectModule } from '@angular/material/select'
import { Subject, map, takeUntil } from 'rxjs'
import { EventsService } from 'src/app/services/events.service'

@Component({
  selector: 'app-form-rooms',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './form-rooms.component.html',
})
export class FormRoomsComponent implements OnInit, OnDestroy {
  public roomsFormControl = new FormControl<string[]>([], { nonNullable: true })

  private destroy$ = new Subject<void>()

  private eventsService = inject(EventsService)

  get roomOptions(): string[] {
    return this.eventsService.filterOptions.rooms
  }

  ngOnInit(): void {
    this.roomsFormControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        map((rooms: string[]) => rooms || []),
      ).subscribe((rooms: string[]) => this.eventsService.onRoomChanges(rooms))
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
