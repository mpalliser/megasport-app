import {
  AsyncPipe, NgClass,
  NgOptimizedImage, NgStyle,
} from '@angular/common'
import { Component, inject, input } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { AvailabilityTypeEnum, EventDto } from 'src/app/models/event-dto'
import { LoaderService } from 'src/app/services/loader.servlce'

@Component({
  standalone: true,
  imports: [NgStyle, NgClass, NgOptimizedImage, MatCardModule, MatIconModule, AsyncPipe],
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.sass'],
})
export class CardComponent {
  public event = input<EventDto>()

  public readonly AVAILABILITY_TYPE_ENUM = AvailabilityTypeEnum

  public readonly isLoading$ = inject(LoaderService).isLoading$
}
