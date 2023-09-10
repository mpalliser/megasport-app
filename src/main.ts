
import { DatePipe } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { importProvidersFrom } from '@angular/core'
import { bootstrapApplication } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Routes, provideRouter } from '@angular/router'
import { throwError } from 'rxjs'
import { AppComponent } from './app/app.component'

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./app/app.component').then((m) => m.AppComponent),
  },
]

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(BrowserAnimationsModule),
    DatePipe,
  ],
}).catch((error) => throwError(() => new Error(error)))
