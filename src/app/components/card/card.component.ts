import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { MatCardModule } from '@angular/material/card'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
  ],
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.sass'],
})
export class CardComponent {
  @Input() event: any
}
