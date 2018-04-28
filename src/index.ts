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

export * from './component';

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
    NgxTinymceModule.forRoot({
      baseURL: '//cdn.bootcss.com/tinymce/4.7.4/',
    }),
  ],
  declarations: [
    RestAdminComponent,
    RestAdminFieldComponent,
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
