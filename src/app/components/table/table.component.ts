import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatTableModule } from '@angular/material/table'
import { Observable } from 'rxjs'
import { EventDataSource } from 'src/app/models/event-datasource'
import { EventsService } from 'src/app/services/events.service'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
  ],
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.sass']
})
export class TableComponent {
  get dataSource(): Observable<EventDataSource[]> {
    return this.eventService.dataSource$
  }
  get columns(): string[] {
    return this.eventService.columns
  }

  constructor(private eventService: EventsService) {
    this.eventService.dataSource$.subscribe(console.log)
  }

  public expandCollapse(element: EventDataSource): void {
    console.log(element)
    element.collapsed = !element.collapsed
  }
}
