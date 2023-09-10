import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { CookieService } from 'ngx-cookie-service'
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
  styleUrls: ['./actions.component.sass']
})
export class ActionsComponent {
  public formGroup: FormGroup = new FormGroup({
    activities: new FormControl(),
    rooms: new FormControl()
  })
  
  get filterOptions(): Filters {
    return this.eventsService.filterOptions
  }

  constructor(
    private readonly eventsService: EventsService,
    private readonly formBuilder: FormBuilder,
    private readonly cookieService: CookieService,
  ) {
    this.eventsService.endpointCall() // TODO: review this to do in app module
    this.initForm()
  }

  private initForm(): void {
    this.formGroup = this.formBuilder.group({
      activities: [this.eventsService.selectedFilters.activities],
      rooms: [this.eventsService.selectedFilters.rooms],
    })

    this.formGroup.valueChanges.subscribe((value: Filters) => {
      this.cookieService.set('filters', JSON.stringify(value))
      this.eventsService.selectedFilters = value
      this.eventsService.applyfilters(value)
    })
  }
}
