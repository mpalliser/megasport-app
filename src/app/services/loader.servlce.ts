import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private isLoading = new BehaviorSubject<boolean>(false)

  get isLoading$(): Observable<boolean> {
    return this.isLoading.asObservable()
  }

  public show(): void {
    this.isLoading.next(true)
  }

  public hide(): void {
    this.isLoading.next(false)
  }
}
