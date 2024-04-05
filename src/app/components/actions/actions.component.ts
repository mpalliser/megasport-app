import { AsyncPipe } from '@angular/common'
import { Component, inject, signal } from '@angular/core'
import {
  FormBuilder, FormControl, FormGroup, ReactiveFormsModule,
} from '@angular/forms'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatButtonModule } from '@angular/material/button'
import { MatChipsModule } from '@angular/material/chips'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { CookieService } from 'ngx-cookie-service'
import {
  Subject, map, startWith, takeUntil,
} from 'rxjs'
import { YEAR } from 'src/app/consts/date'
import { Filters } from 'src/app/models/filters'
import { EventsService } from 'src/app/services/events.service'

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatChipsModule,
    AsyncPipe,
  ],
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.sass'],
})
export class ActionsComponent {
  public formGroup!: FormGroup

  public filteredActivities = signal(this.filterOptions?.activities)

  private eventsService = inject(EventsService)

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public selectedActivities: string[] = this.eventsService.selectedFilters.activities as string[]

  private destroy$ = new Subject<void>()

  private formBuilder = inject(FormBuilder)

  private cookieService = inject(CookieService)

  // TODO: split this component in two, one for input
  constructor() {
    this.initForm()
  }

  get filterOptions(): Filters {
    return this.eventsService?.filterOptions
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

    this.formGroup.get('rooms')?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        map((rooms: string[]) => (rooms || [])),
      ).subscribe((rooms: string[]) => this.onFilterChanges({ activities: this.selectedActivities, rooms }))

    this.formGroup.get('activities')?.valueChanges.pipe(
      startWith(null),
      takeUntil(this.destroy$),
      map((value: string | null) => (value ? this.filter(value) : this.filterOptions.activities)),
    ).subscribe(activities => this.filteredActivities.set(activities))
  }

  private onFilterChanges(filters: Filters): void {
    this.cookieService.set('filters', JSON.stringify(filters), YEAR)
    this.eventsService.selectedFilters = filters
    this.eventsService.applyfilters(filters)
  }
}
