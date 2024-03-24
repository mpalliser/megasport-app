import {
  AsyncPipe,
  NgClass, NgIf, NgOptimizedImage, NgStyle,
} from '@angular/common'
import { Component, Input, inject } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { AvailabilityTypeEnum, EventDto } from 'src/app/models/event-dto'
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
    AsyncPipe,
  ],
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.sass'],
})
export class CardComponent {
  @Input() event!: EventDto

  public readonly AVAILABILITY_TYPE_ENUM = AvailabilityTypeEnum

  isLoading$ = inject(LoaderService).isLoading$
}
