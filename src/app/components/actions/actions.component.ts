import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { CookieService } from 'ngx-cookie-service'
import { Subject, map, takeUntil } from 'rxjs'
import { YEAR } from 'src/app/consts/date'
import { Filters } from 'src/app/models/filters'
import { EventsService } from 'src/app/services/events.service'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatAutocompleteModule,
  ],
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.sass'],
})
export class ActionsComponent {
  public formGroup!: FormGroup

  get filterOptions(): Filters {
    return this.eventsService.filterOptions
  }

  destroy$ = new Subject<void>()

  constructor(
    private readonly eventsService: EventsService,
    private readonly formBuilder: FormBuilder,
    private readonly cookieService: CookieService,
  ) {
    this.getWeekData()
    this.initForm()
  }

  OnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  public getWeekData(isNextWeek = false): void {
    this.eventsService.getWeekData(isNextWeek)
  }

  private initForm(): void {
    this.formGroup = this.formBuilder.group({
      activities: [this.eventsService.selectedFilters.activities],
      rooms: [this.eventsService.selectedFilters.rooms],
    })

    this.formGroup.valueChanges
      .pipe(takeUntil(this.destroy$), map((value: Filters) => this.avoidNullValues(value)))
      .subscribe((value: Filters) => {
        this.cookieService.set('filters', JSON.stringify(value), YEAR)
        this.eventsService.selectedFilters = value
        this.eventsService.applyfilters(value)
      })
  }

  private avoidNullValues(value: Filters): Filters {
    const filter = { activities: value.activities, rooms: value.rooms }
    if (filter.activities === null) {
      filter.activities = []
    }
    if (filter.rooms === null) {
      filter.rooms = []
    }
    return filter
  }
}
