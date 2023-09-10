import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatTableModule } from '@angular/material/table'
import { CardComponent } from 'src/app/components/card/card.component'
import { EventDataSource } from 'src/app/models/event-data-source'
import { EventsService } from 'src/app/services/events.service'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
  ],
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.sass'],
})
export class TableComponent {
  columns: string[] = []

  dataSource: EventDataSource[] = []

  constructor(private eventService: EventsService) {
    this.eventService.columns.subscribe((columns: string[]) => {
      this.columns = columns
    })

    this.eventService.dataSource$.subscribe((dataSource: EventDataSource[]) => {
      this.dataSource = dataSource
    })
  }

  public expandCollapse(element: EventDataSource): void {
    // eslint-disable-next-line no-param-reassign
    element.collapsed = !element.collapsed as boolean
  }
}
