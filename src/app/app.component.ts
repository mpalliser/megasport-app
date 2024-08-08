import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { injectSpeedInsights } from '@vercel/speed-insights'
import { FormActivitiesComponent } from 'src/app/components/form-activities/form-activities.component'
import { FormRoomsComponent } from 'src/app/components/form-rooms/form-rooms.component'
import { EventsService } from 'src/app/services/events.service'
import { TableComponent } from './components/table/table.component'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    FormActivitiesComponent,
    FormRoomsComponent,
  ],
  selector: 'app-root',
  template: `
@defer (when (dataSource | async)?.length) {
    <section>
      <app-form-activities/>
      <app-form-rooms/>
    </section>

  <app-table></app-table>
} @loading (minimum 0.5s) {
  <div class="spinner-container">
    <div class="spinner">
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
}
`,
})
export class AppComponent {
  public readonly dataSource = inject(EventsService)?.dataSource$

  constructor() {
    injectSpeedInsights()
  }
}
