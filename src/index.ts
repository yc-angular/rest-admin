import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  InputTextModule,
  InputTextareaModule,
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
  ChipsModule,
  PickListModule
} from 'primeng/primeng';
import { RestAdminComponent } from './component';

export * from './component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
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
    ChipsModule,
    PickListModule
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
