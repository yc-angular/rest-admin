import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  InputSwitchModule,
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
  PickListModule,
  CheckboxModule,
  BlockUIModule,
  ProgressSpinnerModule,
  AutoCompleteModule,
  PanelModule,
} from 'primeng/primeng';
import { NgxTinymceModule } from 'ngx-tinymce';
import { RestAdminComponent } from './component';
import { RestAdminFieldComponent } from './field.component';
import { SafePipe } from './pipe';

export * from './component';
export * from './field.component';
export * from './interfaces';
export * from './pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputSwitchModule,
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
    PickListModule,
    CheckboxModule,
    BlockUIModule,
    ProgressSpinnerModule,
    AutoCompleteModule,
    PanelModule,
    NgxTinymceModule.forRoot({ }),
  ],
  declarations: [RestAdminComponent, RestAdminFieldComponent, SafePipe],
  exports: [RestAdminComponent, RestAdminFieldComponent, SafePipe],
})
export class RestAdminModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RestAdminModule,
    };
  }
}
