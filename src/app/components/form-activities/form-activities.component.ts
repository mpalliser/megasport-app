/* eslint-disable @typescript-eslint/member-ordering */
import {
  Component, ElementRef, OnDestroy, OnInit, ViewChild, inject,
  signal,
  viewChild,
} from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatButtonModule } from '@angular/material/button'
import { MatChipsModule } from '@angular/material/chips'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import {
  Subject,
  map, takeUntil,
} from 'rxjs'
import { EventsService } from 'src/app/services/events.service'

@Component({
  selector: 'app-form-activities',
  standalone: true,
  imports: [
    MatAutocompleteModule,
    MatButtonModule,
    MatChipsModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './form-activities.component.html',
})
export class FormActivitiesComponent implements OnInit, OnDestroy {
  public readonly eventsService = inject(EventsService)

  public filteredActivities = signal(this.eventsService.filterOptions?.activities)

  public readonly activitiesFormControl = new FormControl<string>('', { nonNullable: true })

  public selectedActivities: string[] = this.eventsService.selectedFilters.activities as string[]

  private readonly activitiesInput = viewChild.required<ElementRef<HTMLInputElement>>('activitiesInput')

  private readonly destroy$ = new Subject<void>()

  ngOnInit(): void {
    this.activitiesFormControl.valueChanges.pipe(
      takeUntil(this.destroy$),
      map((value: string) => (value ? this.filterActivityOptions(value) : this.eventsService.filterOptions?.activities)),
    ).subscribe(activities => this.filteredActivities.set(activities))
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  public onUnselectActivity(value: string): void {
    this.selectedActivities = this.selectedActivities.filter(activity => activity !== value)
    this.eventsService.onActivitiesChanges(this.selectedActivities)
  }

  public onSelectActivity(value: string): void {
    this.selectedActivities = [...this.selectedActivities, value]
    this.eventsService.onActivitiesChanges(this.selectedActivities)
    this.activitiesFormControl.reset()
    this.activitiesInput().nativeElement.value = ''
  }

  private filterActivityOptions(value: string): string[] {
    const filterValue = value.toLowerCase()
    return this.eventsService.filterOptions?.activities?.filter(option => option.toLowerCase().includes(filterValue)) ?? []
  }
}
