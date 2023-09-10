import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActionsComponent } from './components/actions/actions.component';
import { TableComponent } from './components/table/table.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ActionsComponent,
    TableComponent,
  ],
  selector: 'app-root',
  template: `
  <app-actions></app-actions>
  
  <app-table></app-table>`,
})
export class AppComponent {}
