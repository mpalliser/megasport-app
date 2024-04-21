import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { FormActivitiesComponent } from 'src/app/components/form-activities/form-activities.component'
import { FormRoomsComponent } from 'src/app/components/form-rooms/form-rooms.component'
import { injectSpeedInsights } from '@vercel/speed-insights'
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
  <section>
    <app-form-activities/>
    <app-form-rooms/>
  </section>

  <app-table></app-table>`,
})
export class AppComponent {
  constructor() {
    injectSpeedInsights()
  }
}
