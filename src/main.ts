import { DatePipe } from '@angular/common'
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { importProvidersFrom } from '@angular/core'
import { bootstrapApplication } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Routes, provideRouter } from '@angular/router'
import { throwError } from 'rxjs'
import { LoaderInterceptor } from './app/interceptors/loader.interceptor'
import { AppComponent } from './app/app.component'

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./app/app.component').then(m => m.AppComponent),
  },
]

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(BrowserAnimationsModule),
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true,
    },
  ],
}).catch(error => throwError(() => new Error(error)))
