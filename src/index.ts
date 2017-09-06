import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  InputTextModule,
  ButtonModule,
  DataTableModule,
  PaginatorModule,
  DialogModule,
  ConfirmDialogModule,
  DropdownModule,
  GrowlModule,
  ToolbarModule,
  MultiSelectModule,
  CalendarModule,
  SliderModule,
  ChipsModule
} from 'primeng/primeng';
import { RestAdminComponent } from './component';

export * from './component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    DataTableModule,
    PaginatorModule,
    DialogModule,
    ConfirmDialogModule,
    DropdownModule,
    GrowlModule,
    ToolbarModule,
    MultiSelectModule,
    CalendarModule,
    SliderModule,
    ChipsModule
  ],
  declarations: [
    RestAdminComponent
  ],
  exports: [
    RestAdminComponent
  ]
})
export class RestAdminModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RestAdminModule,
    };
  }
}
