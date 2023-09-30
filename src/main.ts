import { DatePipe, registerLocaleData } from '@angular/common'
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { LOCALE_ID, importProvidersFrom } from '@angular/core'
import { bootstrapApplication } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Routes, provideRouter } from '@angular/router'
import { throwError } from 'rxjs'
import localeEs from '@angular/common/locales/es'
import { AppComponent } from './app/app.component'
import { LoaderInterceptor } from './app/interceptors/loader.interceptor'

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./app/app.component').then(m => m.AppComponent),
  },
]

registerLocaleData(localeEs, 'es')

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(BrowserAnimationsModule),
    DatePipe,
    { provide: LOCALE_ID, useValue: 'es' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true,
    },
  ],
}).catch(error => throwError(() => new Error(error)))
