import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import {
  FormBuilder, FormControl, FormGroup, ReactiveFormsModule,
} from '@angular/forms'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatChipsModule } from '@angular/material/chips'
import { CookieService } from 'ngx-cookie-service'
import {
  Observable, Subject, map, of, startWith, takeUntil,
} from 'rxjs'
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
    MatChipsModule,
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

  public filteredActivities: Observable<string[] | undefined> | undefined = of(this.filterOptions.activities)

  public selectedActivities: string[] = []

  destroy$ = new Subject<void>()

  constructor(
    private readonly eventsService: EventsService,
    private readonly formBuilder: FormBuilder,
    private readonly cookieService: CookieService,
  ) {
    this.initForm()
    this.filteredActivities = this.formGroup.get('activities')?.valueChanges.pipe(
      startWith(null),
      map((value: string | null) => (value ? this.filter(value) : this.filterOptions.activities)),
    )
  }

  get activitiesControl(): FormControl {
    return this.formGroup.get('activities') as FormControl
  }

  OnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  public onUnselectActivity(value: string): void {
    this.selectedActivities = this.selectedActivities.filter(activity => activity !== value)
    this.onFilterChanges({ activities: this.selectedActivities, rooms: this.formGroup.get('rooms')?.value })
  }

  public onSelectActivity(value: string): void {
    this.selectedActivities = [...this.selectedActivities, value]
    this.onFilterChanges({ activities: this.selectedActivities, rooms: this.formGroup.get('rooms')?.value })
    this.activitiesControl.reset()
  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase()

    return this.filterOptions.activities?.filter(option => option.toLowerCase().includes(filterValue)) ?? []
  }

  private initForm(): void {
    this.formGroup = this.formBuilder.group({
      activities: [null],
      rooms: [this.eventsService.selectedFilters.rooms],
    })

    this.selectedActivities = this.eventsService.selectedFilters.activities as string[]

    this.formGroup.get('rooms')?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        map((value: Filters) => this.avoidNullValues(value)),
      ).subscribe((value: Filters) => this.onFilterChanges(value))
  }

  private onFilterChanges(value: Filters): void {
    this.cookieService.set('filters', JSON.stringify(value), YEAR)
    this.eventsService.selectedFilters = value
    this.eventsService.applyfilters(value)
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
