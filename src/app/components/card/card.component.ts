import {
  NgClass, NgIf, NgOptimizedImage, NgStyle,
} from '@angular/common'
import { Component, Input, inject } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { EventDto } from 'src/app/models/event-dto'
import { LoaderService } from 'src/app/services/loader.servlce'

@Component({
  standalone: true,
  imports: [
    NgStyle,
    NgClass,
    NgIf,
    NgOptimizedImage,
    MatCardModule,
    MatIconModule,
  ],
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.sass'],
})
export class CardComponent {
  @Input() event!: EventDto

  isLoading$ = inject(LoaderService).isLoading.asObservable()

  isLoading = false

  constructor() {
    this.isLoading$.subscribe((isLoading: boolean) => {
      this.isLoading = isLoading
    })
  }
}
