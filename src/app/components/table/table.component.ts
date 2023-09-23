import { CommonModule } from '@angular/common'
import { HttpErrorResponse } from '@angular/common/http'
import { Component } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { MatTableModule } from '@angular/material/table'
import { filter } from 'rxjs'
import { CardComponent } from 'src/app/components/card/card.component'
import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component'
import { EventDataSource } from 'src/app/models/event-data-source'
import { EventDto } from 'src/app/models/event-dto'
import { EventsService } from 'src/app/services/events.service'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    ConfirmationDialogComponent,
    MatDialogModule,
    MatSnackBarModule,
  ],
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.sass'],
})
export class TableComponent {
  columns: string[] = []

  dataSource: EventDataSource[] = []

  constructor(
    private eventService: EventsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    this.eventService.columns.subscribe((columns: string[]) => {
      this.columns = columns
    })

    this.eventService.dataSource$.subscribe((dataSource: EventDataSource[]) => {
      this.dataSource = dataSource
    })
  }

  public openDialog(data: EventDto): void {
    const dialog = this.dialog.open(ConfirmationDialogComponent, { data })

    dialog.afterClosed()
      .pipe(filter(userEmail => userEmail))
      .subscribe((userEmail: string) => {
        this.eventService.inscribe(data, userEmail).subscribe({
          next: () => this.snackBar.open('Reservado', '', { duration: 2000 }),
          error: (error: HttpErrorResponse) => this.snackBar.open(error.error.errors, 'Cerrar', { duration: 5000 }),
        })
      })
  }

  public expandCollapse(element: EventDataSource): void {
    // eslint-disable-next-line no-param-reassign
    element.collapsed = !element.collapsed as boolean
  }
}
