import { CommonModule } from '@angular/common'
import { Component, Inject } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog'
import { EventDto } from 'src/app/models/event-dto'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
  ],
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.sass'],
})
export class ConfirmationDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: EventDto) {}
}
